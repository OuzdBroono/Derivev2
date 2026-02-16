/**
 * Système de boutique
 */

class ShopSystem {
    constructor() {
        this.items = this.createShopItems();
        this.purchasedItems = [];
    }

    /**
     * Crée les items de la boutique
     */
    createShopItems() {
        return [
            {
                id: 'shield',
                name: 'Bouclier Énergétique',
                description: 'Absorbe une attaque ennemie',
                cost: 10,
                type: 'upgrade',
                duration: 15,
                icon: '🛡️'
            },
            {
                id: 'rapidFire',
                name: 'Tir Rapide',
                description: 'Double la cadence de tir pendant 15s',
                cost: 15,
                type: 'upgrade',
                duration: 15,
                icon: '⚡'
            },
            {
                id: 'heal',
                name: 'Réparation',
                description: 'Restaure 50 points de vie',
                cost: 8,
                type: 'consumable',
                healAmount: 50,
                icon: '❤️'
            },
            {
                id: 'damage',
                name: 'Surcharge Offensive',
                description: 'Double les dégâts pour ce niveau',
                cost: 20,
                type: 'upgrade',
                icon: '💥'
            },
            {
                id: 'speed',
                name: 'Propulseurs Améliorés',
                description: 'Augmente la vitesse de 50%',
                cost: 12,
                type: 'upgrade',
                icon: '🚀'
            },
            {
                id: 'magnet',
                name: 'Aimant à Poussière',
                description: 'Attire automatiquement les étoiles',
                cost: 25,
                type: 'upgrade',
                duration: 20,
                icon: '🧲'
            }
        ];
    }

    /**
     * Obtient les items disponibles
     */
    getAvailableItems() {
        return this.items.filter(item => {
            // Les consommables sont toujours disponibles
            if (item.type === 'consumable') return true;

            // Les upgrades ne peuvent être achetés qu'une fois par session shop
            return !this.purchasedItems.includes(item.id);
        });
    }

    /**
     * Achète un item
     */
    purchaseItem(itemId, player, dust) {
        const item = this.items.find(i => i.id === itemId);

        if (!item) return { success: false, message: 'Item non trouvé' };

        if (dust < item.cost) {
            return { success: false, message: 'Pas assez de poussière' };
        }

        // Vérifie si déjà acheté (sauf consommables)
        if (item.type !== 'consumable' && this.purchasedItems.includes(itemId)) {
            return { success: false, message: 'Déjà acheté' };
        }

        // Applique l'effet
        switch (item.id) {
            case 'shield':
                player.activateUpgrade('shield', item.duration);
                break;

            case 'rapidFire':
                player.activateUpgrade('rapidFire', item.duration);
                break;

            case 'heal':
                player.heal(item.healAmount);
                break;

            case 'damage':
                player.activateUpgrade('damage');
                break;

            case 'speed':
                player.activateUpgrade('speed');
                break;

            case 'magnet':
                // Implémenté dans la logique du jeu
                break;
        }

        // Marque comme acheté
        if (item.type !== 'consumable') {
            this.purchasedItems.push(itemId);
        }

        audioSystem.playCollect();

        return {
            success: true,
            cost: item.cost,
            item: item
        };
    }

    /**
     * Réinitialise les achats (nouveau niveau)
     */
    reset() {
        this.purchasedItems = [];
    }

    /**
     * Affiche la boutique dans le DOM
     */
    displayShop(dustAmount, onPurchase) {
        const shopItems = document.getElementById('shopItems');
        shopItems.innerHTML = '';

        const availableItems = this.getAvailableItems();

        availableItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';

            const canAfford = dustAmount >= item.cost;
            const isPurchased = this.purchasedItems.includes(item.id);

            if (!canAfford) {
                itemDiv.style.opacity = '0.5';
                itemDiv.style.cursor = 'not-allowed';
            }

            if (isPurchased) {
                itemDiv.classList.add('purchased');
            }

            itemDiv.innerHTML = `
                <div class="shop-item-icon" style="font-size: 2rem; margin-bottom: 0.5rem;">
                    ${item.icon}
                </div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-desc">${item.description}</div>
                <div class="shop-item-price">
                    ${item.cost} ⭐
                </div>
                ${isPurchased ? '<div style="color: #4ade80; margin-top: 0.5rem;">✓ Acheté</div>' : ''}
            `;

            if (canAfford && !isPurchased) {
                itemDiv.addEventListener('click', () => {
                    onPurchase(item.id);
                });
            }

            shopItems.appendChild(itemDiv);
        });
    }
}
