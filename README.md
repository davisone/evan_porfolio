# Portfolio - Evan Davison

Portfolio personnel développé avec HTML, CSS et JavaScript vanilla.

## 🚀 Déploiement sur GitHub Pages

### Configuration GitHub Pages

1. Allez dans **Settings** → **Pages** de votre dépôt GitHub
2. Dans "Build and deployment", sélectionnez **GitHub Actions** comme source
3. Le workflow `.github/workflows/deploy.yml` sera automatiquement exécuté à chaque push sur `main`

### Déploiement manuel

Si vous rencontrez l'erreur `ECONNRESET` :

1. Vérifiez votre connexion internet
2. Réessayez le déploiement avec :
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```
3. Si l'erreur persiste, allez dans l'onglet **Actions** de votre dépôt et cliquez sur "Re-run all jobs"

## 📦 Structure du projet

```
evan_portfolio/
├── .github/workflows/
│   └── deploy.yml          # Workflow GitHub Actions
├── assets/
│   └── img/               # Images et ressources
├── css/
│   └── style.css          # Styles CSS
├── js/
│   └── script.js          # JavaScript
├── pages/                 # Pages supplémentaires
├── index.html             # Page d'accueil
└── manifest.json          # PWA manifest
```

## ✨ Fonctionnalités

- Design responsive
- Animations CSS
- Formulaire de contact via Formspree
- Gestion des cookies (RGPD)
- Content Security Policy (CSP)
- Accessibilité (ARIA)
- SEO optimisé

## 🛠️ Technologies utilisées

- HTML5
- CSS3
- JavaScript ES6+
- GitHub Actions pour le déploiement

## 📝 Licence

© 2025 Evan Davison - Tous droits réservés