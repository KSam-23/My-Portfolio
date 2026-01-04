// Portfolio Data extracted from resume
const portfolioData = {
    projects: [
        {
            title: "RetinaScan-AI",
            subtitle: "Diabetic Retinopathy Detection System",
            description: "CNN model trained on 35K+ retinal images to classify diabetic retinopathy across 5 severity levels, achieving 0.70 kappa score using dual-eye fusion architecture.",
            tech: ["Python", "TensorFlow", "OpenCV", "Flask"],
            highlights: [
                "Implemented preprocessing pipeline using OpenCV (CLAHE, denoising)",
                "Deployed via Flask REST API for real-time predictions",
                "Addressed class imbalance through selective augmentation"
            ],
            github: "https://github.com/KSam-23",
            icon: "🔬"
        },
        {
            title: "Crime Analysis Dashboard",
            subtitle: "Power BI Analytics Platform",
            description: "Analyzed 2,500+ crime incidents across 13 countries using Power Query ETL and DAX; built relational data model connecting 7,461 records tracking 70% resolution rate.",
            tech: ["Power BI", "DAX", "Power Query", "SQL"],
            highlights: [
                "Created DAX measures tracking year-over-year trends (405 to 1,150 cases)",
                "Highlighted 30% unresolved backlog across 12 crime categories",
                "Designed interactive dashboards with drill-through and heatmap visualizations"
            ],
            github: "https://github.com/KSam-23",
            icon: "📊"
        },
        {
            title: "Healthcare Performance Analytics",
            subtitle: "HCAHPS Survey Analysis",
            description: "Analyzed HCAHPS survey data (43,200+ responses over 9 years) using DAX and statistical trend analysis, identifying baseline satisfaction metrics (62.9%).",
            tech: ["Power BI", "DAX", "Statistical Modeling"],
            highlights: [
                "Built BI framework with regional benchmarking across 15+ states",
                "Automated anomaly detection for satisfaction scores",
                "Implemented data quality assurance protocols ensuring 99.8% accuracy"
            ],
            link: "#",
            icon: "🏥"
        }
    ],
    skills: {
        "Data Analysis": ["Excel (VLOOKUP, Pivot Tables, VBA, Macros)", "Data Wrangling", "Exploratory Data Analysis (EDA)"],
        "Data Science & ML": ["Statistical Analysis", "Predictive Modeling", "Machine Learning", "Data Mining", "A/B Testing", "Regression Analysis"],
        "Programming": ["Python (Pandas, NumPy, Scikit-learn)", "SQL (PostgreSQL, MySQL)", "R Programming"],
        "BI & Visualization": ["Power BI (DAX, Power Query)", "Tableau", "Interactive Dashboards"],
        "Tools & Platforms": ["Apache Airflow", "ETL Development", "Git", "Agile/Scrum"]
    },
    certifications: [
        "Google Data Analytics Professional Certificate",
        "Power BI Data Analyst Associate",
        "SQL Server Certification"
    ]
};
