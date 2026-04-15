import type { LearningModule } from "@/types"

const modules: LearningModule[] = [
  {
    id: "linear-regression",
    title: "Linear Regression",
    level: "Beginner",
    description: "Learn how machines predict continuous values",
    concepts: ["What is regression", "Cost function", "Gradient Descent", "Overfitting vs Underfitting"],
    examples: ["House price prediction", "Weather forecasting", "Sales estimation"],
    quizTopic: "Linear Regression"
  },
  {
    id: "decision-trees",
    title: "Decision Trees",
    level: "Beginner",
    description: "Learn how machines make decisions step by step",
    concepts: ["Nodes and branches", "Information Gain", "Gini Impurity", "Pruning"],
    examples: ["Loan approval", "Medical diagnosis", "Email filtering"],
    quizTopic: "Decision Trees"
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    level: "Intermediate",
    description: "Understand how artificial brains learn patterns",
    concepts: ["Neurons and layers", "Activation functions", "Backpropagation", "Weights and biases"],
    examples: ["Image recognition", "Voice assistants", "Fraud detection"],
    quizTopic: "Neural Networks"
  },
  {
    id: "clustering",
    title: "K-Means Clustering",
    level: "Intermediate",
    description: "Discover hidden groups in unlabeled data",
    concepts: ["Unsupervised learning", "Centroids", "Inertia", "Choosing K"],
    examples: ["Customer segmentation", "Document grouping", "Anomaly detection"],
    quizTopic: "K-Means Clustering"
  },
  {
    id: "random-forest",
    title: "Random Forest",
    level: "Advanced",
    description: "Master ensemble methods for powerful predictions",
    concepts: ["Ensemble learning", "Bagging", "Feature importance", "Variance reduction"],
    examples: ["Stock prediction", "Risk assessment", "Bioinformatics"],
    quizTopic: "Random Forest"
  },
  {
    id: "svm",
    title: "Support Vector Machines",
    level: "Advanced",
    description: "Learn the algorithm that finds the perfect boundary",
    concepts: ["Hyperplane", "Margin maximization", "Kernel trick", "Support vectors"],
    examples: ["Face detection", "Text classification", "Handwriting recognition"],
    quizTopic: "SVM"
  }
]

export function getAllModules(): LearningModule[] {
  return modules.map((m) => ({
    ...m,
    concepts: [...m.concepts],
    examples: [...m.examples]
  }))
}

export function getModuleById(id: string): LearningModule | undefined {
  const module = modules.find((m) => m.id === id)
  if (!module) return undefined
  return {
    ...module,
    concepts: [...module.concepts],
    examples: [...module.examples]
  }
}

export function getModulesByLevel(level: LearningModule["level"]): LearningModule[] {
  return modules
    .filter((m) => m.level === level)
    .map((m) => ({
      ...m,
      concepts: [...m.concepts],
      examples: [...m.examples]
    }))
}

