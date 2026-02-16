<?php
/**
 * API Backend pour le système de classement
 * Utilise un fichier JSON avec verrouillage pour éviter les corruptions
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gestion des requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
define('SCORES_FILE', __DIR__ . '/scores.json');
define('MAX_SCORES', 100);
define('MAX_NAME_LENGTH', 20);
define('MIN_NAME_LENGTH', 2);

/**
 * Charge les scores depuis le fichier JSON
 */
function loadScores() {
    if (!file_exists(SCORES_FILE)) {
        return [];
    }

    $content = file_get_contents(SCORES_FILE);
    if ($content === false) {
        return [];
    }

    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

/**
 * Sauvegarde les scores dans le fichier JSON avec verrouillage
 */
function saveScores($scores) {
    $fp = fopen(SCORES_FILE, 'c');
    if ($fp === false) {
        return false;
    }

    // Verrouille le fichier en écriture exclusive
    if (flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($scores, JSON_PRETTY_PRINT));
        fflush($fp);
        flock($fp, LOCK_UN);
    }

    fclose($fp);
    return true;
}

/**
 * Valide un nom de joueur
 */
function validateName($name) {
    $name = trim($name);
    $length = mb_strlen($name);

    if ($length < MIN_NAME_LENGTH || $length > MAX_NAME_LENGTH) {
        return false;
    }

    // Interdit les caractères spéciaux dangereux
    if (preg_match('/[<>"\']/', $name)) {
        return false;
    }

    return $name;
}

/**
 * Valide un score
 */
function validateScore($data) {
    if (!isset($data['score']) || !isset($data['level']) || !isset($data['dust'])) {
        return false;
    }

    if (!is_numeric($data['score']) || !is_numeric($data['level']) || !is_numeric($data['dust'])) {
        return false;
    }

    if ($data['score'] < 0 || $data['level'] < 1 || $data['dust'] < 0) {
        return false;
    }

    // Anti-triche basique : vérifie que le score est cohérent
    $maxExpectedScore = $data['level'] * 10000;
    if ($data['score'] > $maxExpectedScore) {
        return false; // Score trop élevé pour le niveau
    }

    return true;
}

/**
 * Soumet un nouveau score
 */
function submitScore($data) {
    // Validation du nom
    $name = validateName($data['name']);
    if ($name === false) {
        return [
            'success' => false,
            'error' => 'Nom invalide'
        ];
    }

    // Validation du score
    if (!validateScore($data)) {
        return [
            'success' => false,
            'error' => 'Données de score invalides'
        ];
    }

    // Charge les scores existants
    $scores = loadScores();

    // Crée la nouvelle entrée
    $newEntry = [
        'name' => $name,
        'score' => intval($data['score']),
        'level' => intval($data['level']),
        'dust' => intval($data['dust']),
        'timestamp' => time(),
        'ip' => hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown') // Hash pour confidentialité
    ];

    // Ajoute le score
    $scores[] = $newEntry;

    // Trie par score décroissant
    usort($scores, function($a, $b) {
        return $b['score'] - $a['score'];
    });

    // Garde seulement les meilleurs
    $scores = array_slice($scores, 0, MAX_SCORES);

    // Sauvegarde
    if (!saveScores($scores)) {
        return [
            'success' => false,
            'error' => 'Erreur de sauvegarde'
        ];
    }

    // Trouve le rang
    $rank = 0;
    foreach ($scores as $index => $entry) {
        if ($entry['score'] === $newEntry['score'] &&
            $entry['timestamp'] === $newEntry['timestamp']) {
            $rank = $index + 1;
            break;
        }
    }

    return [
        'success' => true,
        'rank' => $rank
    ];
}

/**
 * Récupère le classement
 */
function getLeaderboard($limit = 20) {
    $scores = loadScores();

    // Limite le nombre de résultats
    $limit = min(max(1, intval($limit)), 100);
    $scores = array_slice($scores, 0, $limit);

    // Supprime les informations sensibles
    $publicScores = array_map(function($entry) {
        return [
            'name' => $entry['name'],
            'score' => $entry['score'],
            'level' => $entry['level'],
            'dust' => $entry['dust'],
            'timestamp' => $entry['timestamp']
        ];
    }, $scores);

    return [
        'success' => true,
        'scores' => $publicScores,
        'count' => count($publicScores)
    ];
}

/**
 * Routeur principal
 */
try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        // Lecture du JSON POST
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (!$data || !isset($data['action'])) {
            throw new Exception('Action non spécifiée');
        }

        switch ($data['action']) {
            case 'submit':
                $result = submitScore($data);
                break;

            default:
                throw new Exception('Action inconnue');
        }
    } elseif ($method === 'GET') {
        $action = $_GET['action'] ?? '';

        switch ($action) {
            case 'get':
                $limit = $_GET['limit'] ?? 20;
                $result = getLeaderboard($limit);
                break;

            default:
                throw new Exception('Action inconnue');
        }
    } else {
        throw new Exception('Méthode non supportée');
    }

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
