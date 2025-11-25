//frontend\src\language\translations.ts
export type Language = "fr" | "en";

export const supportedLanguages: Language[] = ["fr", "en"];

export const translations: Record<Language, Record<string, string>> = {
    fr: {
        "common.language.fr": "Français",
        "common.language.en": "Anglais",
        "common.user": "Utilisateur",
        "common.email.placeholder": "Email non renseigné",
        "common.logout": "Se déconnecter",
        "common.appName": "Carbotrack",

        "switcher.label": "Langue",

        "nav.dashboard": "Tableau de bord",
        "nav.vehicles": "Véhicules",
        "nav.trips": "Trajets",
        "nav.lifestyle": "Mode de vie",
        "nav.profile": "Profil",

        "lifestyle.loading": "Chargement...",
        "lifestyle.errorPrefix": "Erreur : ",
        "lifestyle.section.calculator": "Calculateur d'empreinte carbone",
        "lifestyle.title": "Évaluez votre impact climatique",
        "lifestyle.subtitle":
            "Renseignez vos habitudes pour estimer votre empreinte carbone et découvrir des pistes d'amélioration.",
        "lifestyle.info.title": "Pourquoi calculer son empreinte ?",
        "lifestyle.info.text1":
            "Comprendre son impact carbone est la première étape pour agir. Ce calculateur estime vos émissions basées sur vos choix quotidiens.",

        "dashboard.title": "Tableau de bord",
        "dashboard.greeting": "Bonjour",
        "dashboard.subtitle": "Voici un aperçu rapide de votre activité sur Carbotrack.",
        "dashboard.action.newVehicle": "+ Nouveau véhicule",
        "dashboard.stats.vehicles.label": "Véhicules suivis",
        "dashboard.stats.vehicles.helper": "+1 cette semaine",
        "dashboard.stats.trips.label": "Trajets enregistrés",
        "dashboard.stats.trips.helper": "Dernier : hier",
        "dashboard.stats.co2.label": "CO₂ estimé (30 jours)",
        "dashboard.stats.co2.helper": "Basé sur les trajets saisis",
        "dashboard.latestTrips.title": "Derniers trajets",
        "dashboard.latestTrips.cta": "Voir tout",
        "dashboard.latestTrips.text":
            "Ici on affichera bientôt les trajets les plus récents issus du backend.",
        "dashboard.latestTrips.item.placeholder1":
            "• Placeholder – intégration réelle à venir.",
        "dashboard.latestTrips.item.placeholder2":
            "• Distance, type de véhicule, CO₂ estimé, etc.",
        "dashboard.nextSteps.title": "Prochaines étapes du projet",
        "dashboard.nextSteps.step1":
            "Connecter les véhicules et trajets au backend.",
        "dashboard.nextSteps.step2":
            "Afficher les vrais trajets dans la section de gauche.",
        "dashboard.nextSteps.step3":
            "Ajouter des filtres (période, type de véhicule, etc.).",

        "profile.title": "Profil",
        "profile.greeting": "Bonjour",
        "profile.subtitle":
            "Gérez vos informations de compte et vos préférences Carbotrack.",
        "profile.account.title": "Informations du compte",
        "profile.account.displayName": "Nom affiché",
        "profile.account.email": "Adresse e-mail",
        "profile.account.organization": "Organisation",
        "profile.account.organization.placeholder":
            "À connecter plus tard avec les données du backend.",
        "profile.security.title": "Sécurité",
        "profile.security.text":
            "Ces actions seront branchées plus tard au backend.",
        "profile.security.changePassword": "Modifier le mot de passe",
        "profile.security.sessions": "Gérer les sessions actives",
        "profile.preferences.title": "Préférences",
        "profile.preferences.text":
            "Ici on pourra gérer les unités (km / miles), le thème, les notifications, etc.",

        "trips.title": "Trajets",
        "trips.header": "Historique des trajets",
        "trips.subtitle":
            "Consulte et filtre tes trajets pour suivre ton empreinte carbone.",
        "trips.action.newTrip": "+ Nouveau trajet",
        "trips.filters.label": "Filtres rapides",
        "trips.filters.last7Days": "7 derniers jours",
        "trips.filters.thisMonth": "Ce mois-ci",
        "trips.filters.all": "Tous les trajets",
        "trips.list.title": "Trajets enregistrés",
        "trips.list.countSuffix": "trajet(s)",
        "trips.list.empty":
            "Aucun trajet pour le moment. Ajoute ton premier trajet pour voir apparaître ton historique ici.",
        "trips.list.co2Label": "CO₂ estimé",
        "trips.actions.edit": "Modifier",
        "trips.actions.delete": "Supprimer",
        "trips.tag.homeToMission": "Domicile → Mission",
        "trips.tag.return": "Retour",
        "trips.tag.daily": "Trajet quotidien",

        "vehicles.title": "Véhicules",
        "vehicles.header": "Mes véhicules",
        "vehicles.subtitle":
            "Gérez les véhicules utilisés pour vos trajets et le calcul de vos émissions.",
        "vehicles.action.newVehicle": "+ Ajouter un véhicule",
        "vehicles.summary.vehicles.label": "Véhicules suivis",
        "vehicles.summary.vehicles.helper": "Nombre total configuré",
        "vehicles.summary.types.label": "Types différents",
        "vehicles.summary.types.helper": "Citadine, SUV, etc.",
        "vehicles.summary.fuels.label": "Types de carburant",
        "vehicles.summary.fuels.helper": "Essence, Diesel, Électrique…",
        "vehicles.list.title": "Liste des véhicules",
        "vehicles.list.status.loading": "Chargement des véhicules…",
        "vehicles.list.status.error": "Erreur de chargement",
        "vehicles.list.status.empty": "Aucun véhicule pour le moment.",
        "vehicles.list.status.count.singular": "véhicule",
        "vehicles.list.status.count.plural": "véhicules",
        "vehicles.error.unableToLoad":
            "Impossible de charger vos véhicules pour le moment.",
        "vehicles.fuel.essence": "Essence",
        "vehicles.fuel.diesel": "Diesel",
        "vehicles.fuel.electrique": "Électrique",
        "vehicles.fuel.hybride": "Hybride",
        "vehicles.fuel.gpl": "GPL",
        "vehicles.fuel.other": "Autre",
        "vehicles.actions.edit": "Modifier",
        "vehicles.actions.delete": "Supprimer"
    },
    en: {
        "common.language.fr": "French",
        "common.language.en": "English",
        "common.user": "User",
        "common.email.placeholder": "Email not provided",
        "common.logout": "Log out",
        "common.appName": "Carbotrack",

        "switcher.label": "Language",

        "nav.dashboard": "Dashboard",
        "nav.vehicles": "Vehicles",
        "nav.trips": "Trips",
        "nav.lifestyle": "Lifestyle",
        "nav.profile": "Profile",

        "lifestyle.loading": "Loading...",
        "lifestyle.errorPrefix": "Error: ",
        "lifestyle.section.calculator": "Carbon footprint calculator",
        "lifestyle.title": "Assess your climate impact",
        "lifestyle.subtitle":
            "Enter your habits to estimate your carbon footprint and discover ways to improve it.",
        "lifestyle.info.title": "Why calculate your footprint?",
        "lifestyle.info.text1":
            "Understanding your carbon impact is the first step to taking action. This calculator estimates your emissions based on your daily choices.",

        "dashboard.title": "Dashboard",
        "dashboard.greeting": "Hello",
        "dashboard.subtitle":
            "Here is a quick overview of your activity on Carbotrack.",
        "dashboard.action.newVehicle": "+ New vehicle",
        "dashboard.stats.vehicles.label": "Tracked vehicles",
        "dashboard.stats.vehicles.helper": "+1 this week",
        "dashboard.stats.trips.label": "Recorded trips",
        "dashboard.stats.trips.helper": "Last: yesterday",
        "dashboard.stats.co2.label": "Estimated CO₂ (30 days)",
        "dashboard.stats.co2.helper": "Based on the entered trips",
        "dashboard.latestTrips.title": "Latest trips",
        "dashboard.latestTrips.cta": "View all",
        "dashboard.latestTrips.text":
            "Soon, the most recent trips from the backend will appear here.",
        "dashboard.latestTrips.item.placeholder1":
            "• Placeholder – real integration coming soon.",
        "dashboard.latestTrips.item.placeholder2":
            "• Distance, vehicle type, estimated CO₂, etc.",
        "dashboard.nextSteps.title": "Next steps of the project",
        "dashboard.nextSteps.step1":
            "Connect vehicles and trips to the backend.",
        "dashboard.nextSteps.step2":
            "Display real trips in the left section.",
        "dashboard.nextSteps.step3":
            "Add filters (period, vehicle type, etc.).",

        "profile.title": "Profile",
        "profile.greeting": "Hello",
        "profile.subtitle":
            "Manage your account information and your Carbotrack preferences.",
        "profile.account.title": "Account information",
        "profile.account.displayName": "Display name",
        "profile.account.email": "Email address",
        "profile.account.organization": "Organization",
        "profile.account.organization.placeholder":
            "To be connected later with backend data.",
        "profile.security.title": "Security",
        "profile.security.text":
            "These actions will be wired to the backend later.",
        "profile.security.changePassword": "Change password",
        "profile.security.sessions": "Manage active sessions",
        "profile.preferences.title": "Preferences",
        "profile.preferences.text":
            "Here you will be able to manage units (km/miles), theme, notifications, etc.",

        "trips.title": "Trips",
        "trips.header": "Trip history",
        "trips.subtitle":
            "View and filter your trips to track your carbon footprint.",
        "trips.action.newTrip": "+ New trip",
        "trips.filters.label": "Quick filters",
        "trips.filters.last7Days": "Last 7 days",
        "trips.filters.thisMonth": "This month",
        "trips.filters.all": "All trips",
        "trips.list.title": "Recorded trips",
        "trips.list.countSuffix": "trip(s)",
        "trips.list.empty":
            "No trip yet. Add your first trip to see your history appear here.",
        "trips.list.co2Label": "Estimated CO₂",
        "trips.actions.edit": "Edit",
        "trips.actions.delete": "Delete",
        "trips.tag.homeToMission": "Home → Mission",
        "trips.tag.return": "Return",
        "trips.tag.daily": "Daily trip",

        "vehicles.title": "Vehicles",
        "vehicles.header": "My vehicles",
        "vehicles.subtitle":
            "Manage the vehicles used for your trips and the calculation of your emissions.",
        "vehicles.action.newVehicle": "+ Add a vehicle",
        "vehicles.summary.vehicles.label": "Tracked vehicles",
        "vehicles.summary.vehicles.helper": "Total configured",
        "vehicles.summary.types.label": "Different types",
        "vehicles.summary.types.helper": "City car, SUV, etc.",
        "vehicles.summary.fuels.label": "Fuel types",
        "vehicles.summary.fuels.helper": "Petrol, diesel, electric…",
        "vehicles.list.title": "Vehicle list",
        "vehicles.list.status.loading": "Loading vehicles…",
        "vehicles.list.status.error": "Loading error",
        "vehicles.list.status.empty": "No vehicle yet.",
        "vehicles.list.status.count.singular": "vehicle",
        "vehicles.list.status.count.plural": "vehicles",
        "vehicles.error.unableToLoad":
            "Unable to load your vehicles at the moment.",
        "vehicles.fuel.essence": "Petrol",
        "vehicles.fuel.diesel": "Diesel",
        "vehicles.fuel.electrique": "Electric",
        "vehicles.fuel.hybride": "Hybrid",
        "vehicles.fuel.gpl": "LPG",
        "vehicles.fuel.other": "Other",
        "vehicles.actions.edit": "Edit",
        "vehicles.actions.delete": "Delete"
    }
};
