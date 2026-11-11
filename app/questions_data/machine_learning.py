"""
Machine Learning Question Bank: 100 Approved MCQs (50 Set A, 50 Set B)
Balanced difficulty: 16 Beginner, 18 Intermediate, 16 Advanced per set.
Equivalent topic coverage across both sets.
"""

def get_machine_learning_questions():
    questions = []

    # ==========================================
    # SET A (50 Questions)
    # ==========================================
    
    # --- Beginner (16 Questions) ---
    questions.append({
        "id": "ML-A-01",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Supervised vs Unsupervised",
        "question_text": "Which of the following problems is an example of supervised machine learning?",
        "option_a": "Grouping customer purchase histories into clusters without pre-existing categories",
        "option_b": "Predicting the resale value of a used car based on historical sale records with known prices",
        "option_c": "Compressing images using Principal Component Analysis",
        "option_d": "Detecting rare anomalies in server traffic without labeled anomaly instances",
        "correct_option": "B",
        "explanation": "Supervised learning relies on labeled input-output pairs. Predicting car resale prices from known historical prices is a regression task with labeled targets."
    })
    questions.append({
        "id": "ML-A-02",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Linear Regression",
        "question_text": "What loss function is most commonly minimized when solving Ordinary Least Squares (OLS) linear regression?",
        "option_a": "Hinge Loss",
        "option_b": "Binary Cross-Entropy Loss",
        "option_c": "Mean Squared Error (MSE)",
        "option_d": "Kullback-Leibler Divergence",
        "correct_option": "C",
        "explanation": "Ordinary Least Squares linear regression minimizes the sum of squared differences between observed and predicted values, which is Mean Squared Error (MSE)."
    })
    questions.append({
        "id": "ML-A-03",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Logistic Regression",
        "question_text": "What is the primary function of the sigmoid activation function in binary logistic regression?",
        "option_a": "To scale unbounded linear outputs into a probability distribution between 0 and 1",
        "option_b": "To eliminate the need for gradient descent optimization",
        "option_c": "To convert multiclass classification labels into continuous regression values",
        "option_d": "To enforce sparsity on weight coefficients",
        "correct_option": "A",
        "explanation": "The sigmoid function maps any real-valued number into the interval (0, 1), allowing the model's linear output to be interpreted as a posterior probability for the positive class."
    })
    questions.append({
        "id": "ML-A-04",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Overfitting and Underfitting",
        "question_text": "What typically occurs when a machine learning model exhibits high variance?",
        "option_a": "The model has high training error and high test error",
        "option_b": "The model is too simplistic to capture underlying patterns",
        "option_c": "The model achieves very low training error but generalizes poorly to unseen test data",
        "option_d": "The model's predictions remain constant regardless of input features",
        "correct_option": "C",
        "explanation": "High variance corresponds to overfitting: the model learns noise and idiosyncrasies of the training set, yielding very low training error but poor generalization on test data."
    })
    questions.append({
        "id": "ML-A-05",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Feature Scaling",
        "question_text": "Why is feature scaling essential before training algorithms like K-Nearest Neighbors (KNN)?",
        "option_a": "KNN relies on Euclidean distance, so features with larger magnitudes would disproportionately dominate distance calculations",
        "option_b": "KNN requires all input features to follow an exact Gaussian distribution",
        "option_c": "Feature scaling reduces the number of dimensions in the dataset",
        "option_d": "KNN cannot compute derivatives unless features are bounded between 0 and 1",
        "correct_option": "A",
        "explanation": "KNN computes distances between points. Without scaling, a feature with a wide range (e.g. salary: 20,000-200,000) will overpower features with small ranges (e.g. age: 20-70)."
    })
    questions.append({
        "id": "ML-A-06",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Evaluation Metrics",
        "question_text": "In a medical diagnosis task where failing to detect a disease (false negative) is critical, which metric should be prioritized?",
        "option_a": "Specificity",
        "option_b": "Recall (Sensitivity)",
        "option_c": "Precision",
        "option_d": "Accuracy",
        "correct_option": "B",
        "explanation": "Recall measures the proportion of actual positive cases correctly identified (TP / (TP + FN)). Maximizing recall minimizes false negatives."
    })
    questions.append({
        "id": "ML-A-07",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Evaluation Metrics",
        "question_text": "What does an Accuracy score fail to represent effectively when dealing with highly imbalanced datasets?",
        "option_a": "The execution speed of the inference engine",
        "option_b": "Performance on the minority class, as a naive model predicting only the majority class can yield high accuracy",
        "option_c": "The total number of samples evaluated in the test partition",
        "option_d": "The memory consumption during model cross-validation",
        "correct_option": "B",
        "explanation": "On imbalanced data (e.g., 99% non-fraud, 1% fraud), a model predicting all negatives achieves 99% accuracy while failing to identify any fraud."
    })
    questions.append({
        "id": "ML-A-08",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "K-Means Clustering",
        "question_text": "What is the primary objective of the standard K-Means clustering algorithm?",
        "option_a": "To construct an optimal hierarchical tree of clusters",
        "option_b": "To minimize the within-cluster sum of squared distances (inertia)",
        "option_c": "To maximize the margin separating distinct support vectors",
        "option_d": "To compute orthogonal eigenvectors of the covariance matrix",
        "correct_option": "B",
        "explanation": "K-Means iteratively partitions data into K clusters by minimizing the within-cluster sum of squared distances from each point to its assigned centroid."
    })
    questions.append({
        "id": "ML-A-09",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Decision Trees",
        "question_text": "Which metric is commonly used in CART decision tree algorithms to measure the impurity of a potential split?",
        "option_a": "Gini Impurity",
        "option_b": "Euclidean Norm",
        "option_c": "Cosine Similarity",
        "option_d": "Adjusted R-squared",
        "correct_option": "A",
        "explanation": "CART (Classification and Regression Trees) uses Gini Impurity for classification splits and Mean Squared Error for regression splits."
    })
    questions.append({
        "id": "ML-A-10",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Data Preprocessing",
        "question_text": "What is One-Hot Encoding used for in machine learning pipelines?",
        "option_a": "Normalizing continuous numeric variables to have zero mean and unit variance",
        "option_b": "Converting nominal categorical variables into binary indicator columns",
        "option_c": "Imputing missing values with the median of neighboring observations",
        "option_d": "Compressing textual tokens into fixed-length dense vector embeddings",
        "correct_option": "B",
        "explanation": "One-Hot Encoding converts categorical variables without natural ordinal relationship into binary indicator columns (0 or 1)."
    })
    questions.append({
        "id": "ML-A-11",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Ensemble Methods",
        "question_text": "What is the key mechanism behind Bagging (Bootstrap Aggregating)?",
        "option_a": "Training base models sequentially, each correcting errors of the predecessor",
        "option_b": "Training multiple independent models on random bootstrap samples of data and aggregating their predictions",
        "option_c": "Applying L1 regularization to eliminate uninformative features",
        "option_d": "Transforming features into a higher dimensional kernel space",
        "correct_option": "B",
        "explanation": "Bagging draws random bootstrap samples with replacement, trains parallel independent estimators (e.g. decision trees), and averages their outputs to reduce variance."
    })
    questions.append({
        "id": "ML-A-12",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Cross-Validation",
        "question_text": "In K-Fold cross-validation, how is the dataset utilized across iterations?",
        "option_a": "The data is split into K equal folds; each fold is used once as validation data while remaining K-1 folds train the model",
        "option_b": "All K folds are trained simultaneously without any held-out validation set",
        "option_c": "K different machine learning algorithms are trained on the exact same dataset",
        "option_d": "Only 10% of the data is used regardless of the value of K",
        "correct_option": "A",
        "explanation": "In K-Fold cross-validation, data is split into K folds. Across K iterations, each fold serves as the test/validation set exactly once while the other K-1 folds are used for training."
    })
    questions.append({
        "id": "ML-A-13",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Neural Network Basics",
        "question_text": "What role does the activation function play in artificial neural networks?",
        "option_a": "It calculates the learning rate during gradient descent",
        "option_b": "It introduces non-linearity, allowing the network to approximate complex non-linear functions",
        "option_c": "It prevents weights from being updated during backpropagation",
        "option_d": "It scales matrix multiplications to prevent floating point overflow",
        "correct_option": "B",
        "explanation": "Without non-linear activation functions, any multi-layer neural network collapses into a single linear transformation regardless of depth."
    })
    questions.append({
        "id": "ML-A-14",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Hyperparameters vs Parameters",
        "question_text": "Which of the following is considered a model hyperparameter rather than a learned parameter?",
        "option_a": "The weight matrix connecting two dense neural layers",
        "option_b": "The bias term in a linear regression model",
        "option_c": "The maximum depth parameter of a decision tree",
        "option_d": "The split threshold value determined during tree node splitting",
        "correct_option": "C",
        "explanation": "Hyperparameters (like max_depth, learning rate, or number of clusters) are configured prior to training, whereas parameters (weights, biases) are learned from data."
    })
    questions.append({
        "id": "ML-A-15",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Dimensionality Reduction",
        "question_text": "What is the primary geometric concept underlying Principal Component Analysis (PCA)?",
        "option_a": "Maximizing the margin between two opposing classes",
        "option_b": "Projecting data onto orthogonal axes that maximize the captured variance",
        "option_c": "Constructing Voronoi tessellations around cluster centers",
        "option_d": "Computing non-linear geodesic distances along a manifold",
        "correct_option": "B",
        "explanation": "PCA identifies orthogonal directions (principal components) along which data variance is maximized and projects the features onto these axes."
    })
    questions.append({
        "id": "ML-A-16",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Support Vector Machines",
        "question_text": "What are the 'support vectors' in a Support Vector Machine classifier?",
        "option_a": "All training instances correctly classified far outside the decision boundary",
        "option_b": "The specific data points that lie closest to the decision hyperplane and define the margin",
        "option_c": "The random weights initialized before training the kernel",
        "option_d": "The eigenvalues computed from the Gram matrix",
        "correct_option": "B",
        "explanation": "Support vectors are the critical data points residing on the margin boundaries; removing any non-support vector does not alter the optimal hyperplane."
    })

    # --- Intermediate (18 Questions) ---
    questions.append({
        "id": "ML-A-17",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Regularization",
        "question_text": "Why does L1 regularization (Lasso) induce sparse weight vectors while L2 regularization (Ridge) does not?",
        "option_a": "L1 penalty has sharp corners on coordinate axes where diamond-shaped contours intersect the loss surface at zero coordinates",
        "option_b": "L1 optimization uses second-order Hessian approximations that eliminate small weights",
        "option_c": "L2 regularization forces weights to grow exponentially with feature correlation",
        "option_d": "L1 regularization operates only on categorical features",
        "correct_option": "A",
        "explanation": "The L1 constraint region is an absolute-value diamond with vertices on axes. When loss contours intersect these vertices, non-essential weights become exactly zero, driving feature selection."
    })
    questions.append({
        "id": "ML-A-18",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Bias-Variance Tradeoff",
        "question_text": "How does increasing the number of trees in a Random Forest typically affect the bias-variance decomposition?",
        "option_a": "It significantly increases bias while decreasing variance",
        "option_b": "It reduces model variance without substantially increasing individual tree bias",
        "option_c": "It causes the model to severely overfit and exponentially increases variance",
        "option_d": "It has no impact on either bias or variance",
        "correct_option": "B",
        "explanation": "Individual trees in a random forest have low bias but high variance. Averaging decorrelated trees reduces variance without inflating bias."
    })
    questions.append({
        "id": "ML-A-19",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Gradient Boosting",
        "question_text": "In Gradient Boosted Decision Trees (GBDT), what target does each subsequent base learner fit?",
        "option_a": "The original target variable with resampled observation weights",
        "option_b": "The negative gradient (pseudo-residuals) of the loss function with respect to current ensemble predictions",
        "option_c": "The inverse covariance matrix of the input features",
        "option_d": "The principal component projections of earlier errors",
        "correct_option": "B",
        "explanation": "GBDT fits each new weak learner to the negative gradient (pseudo-residuals) of the loss function evaluated at the current ensemble's predictions."
    })
    questions.append({
        "id": "ML-A-20",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Optimization",
        "question_text": "What key distinction sets the Adam optimizer apart from basic Stochastic Gradient Descent (SGD) with momentum?",
        "option_a": "Adam computes individual adaptive learning rates per parameter using estimates of both first and second moments of gradients",
        "option_b": "Adam replaces backpropagation with genetic algorithm weight perturbations",
        "option_c": "Adam requires exact computation of the full dataset Hessian matrix",
        "option_d": "Adam only updates weights in the output layer",
        "correct_option": "A",
        "explanation": "Adam (Adaptive Moment Estimation) tracks exponentially decaying averages of past gradients (first moment) and squared gradients (second moment) to adapt individual parameter learning rates."
    })
    questions.append({
        "id": "ML-A-21",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Loss Functions",
        "question_text": "Why is the Huber loss often preferred over Mean Squared Error (MSE) in linear regression when the training set contains significant outliers?",
        "option_a": "Huber loss is non-convex and prevents gradient descent from converging to local minima",
        "option_b": "Huber loss behaves quadratically for small errors and linearly for large errors, reducing outlier sensitivity",
        "option_c": "Huber loss penalizes large errors with cubic growth",
        "option_d": "Huber loss forces all regression coefficients to remain positive",
        "correct_option": "B",
        "explanation": "Huber loss is robust: it transitions from quadratic (L2) for small residuals (|e| <= delta) to linear (L1) for large residuals, preventing extreme outliers from skewing the model."
    })
    questions.append({
        "id": "ML-A-22",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "ROC and AUC",
        "question_text": "What quantities are plotted along the axes of a standard Receiver Operating Characteristic (ROC) curve?",
        "option_a": "Precision on Y-axis vs. Recall on X-axis",
        "option_b": "True Positive Rate (TPR) on Y-axis vs. False Positive Rate (FPR) on X-axis",
        "option_c": "True Positive Rate on Y-axis vs. False Negative Rate on X-axis",
        "option_d": "Loss value on Y-axis vs. Training Epochs on X-axis",
        "correct_option": "B",
        "explanation": "The ROC curve plots True Positive Rate (Sensitivity) on the Y-axis against False Positive Rate (1 - Specificity) on the X-axis across varying classification thresholds."
    })
    questions.append({
        "id": "ML-A-23",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Clustering",
        "question_text": "What is a major advantage of DBSCAN over standard K-Means clustering?",
        "option_a": "DBSCAN can discover clusters of arbitrary shapes and naturally isolates noise/outliers without requiring K beforehand",
        "option_b": "DBSCAN guarantees linear O(N) execution time on high-dimensional data",
        "option_c": "DBSCAN forces clusters to have identical spherical variances",
        "option_d": "DBSCAN always produces exactly three output clusters",
        "correct_option": "A",
        "explanation": "DBSCAN is a density-based algorithm that identifies clusters of arbitrary geometry and labels low-density points as noise without requiring the number of clusters K to be specified in advance."
    })
    questions.append({
        "id": "ML-A-24",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Feature Engineering",
        "question_text": "When computing Target Encoding for high-cardinality categorical features, what critical technique prevents data leakage and target memorization?",
        "option_a": "Converting categorical values to one-hot encoded sparse matrices",
        "option_b": "Out-of-fold target calculation and additive smoothing with the global prior mean",
        "option_c": "Replacing all category values with random uniform noise",
        "option_d": "Sorting the categories alphabetically prior to encoding",
        "correct_option": "B",
        "explanation": "Out-of-fold computation ensures a sample's own label does not influence its feature value. Smoothing blends rare category means with the global dataset prior to prevent overfitting."
    })
    questions.append({
        "id": "ML-A-25",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Neural Networks",
        "question_text": "What problem does Batch Normalization primarily address during the training of deep neural networks?",
        "option_a": "It stabilizes layer input distributions (internal covariate shift) and smooths the optimization landscape",
        "option_b": "It eliminates the need for activation functions in convolutional layers",
        "option_c": "It forces all hidden layer weights to become non-negative",
        "option_d": "It replaces floating point calculations with integer bitshifts",
        "correct_option": "A",
        "explanation": "Batch Normalization standardizes intermediate activations across mini-batches, stabilizing training dynamics and smoothing the optimization landscape, allowing faster convergence and higher learning rates."
    })
    questions.append({
        "id": "ML-A-26",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Support Vector Machines",
        "question_text": "How does the Radial Basis Function (RBF) kernel allow Support Vector Machines to separate linearly non-separable data?",
        "option_a": "By pruning all features that exhibit negative correlation with the target",
        "option_b": "By implicitly mapping input vectors into an infinite-dimensional Hilbert space via the kernel trick",
        "option_c": "By converting the classification task into an iterative clustering problem",
        "option_d": "By forcing the decision boundary to remain strictly orthogonal to the principal components",
        "correct_option": "B",
        "explanation": "The RBF kernel computes inner products corresponding to an infinite-dimensional feature space without explicitly computing coordinates, making non-linear boundaries linearly separable."
    })
    questions.append({
        "id": "ML-A-27",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Decision Trees",
        "question_text": "Why do tree-based models like Random Forests and XGBoost remain invariant to monotonic feature transformations (e.g. logarithmic scaling)?",
        "option_a": "They normalize features internally to unit variance prior to evaluation",
        "option_b": "Split points are determined purely by feature orderings rather than relative numerical magnitudes",
        "option_c": "They project all features into principal component directions",
        "option_d": "They compute matrix inversions that cancel out scalar factors",
        "correct_option": "B",
        "explanation": "Decision trees choose split thresholds based on the rank order of values. A monotonic transformation preserves order, leaving the optimal split partitions unchanged."
    })
    questions.append({
        "id": "ML-A-28",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Dimensionality Reduction",
        "question_text": "What is the primary difference between PCA and t-SNE in terms of dimensionality reduction objective?",
        "option_a": "PCA preserves global linear variance while t-SNE preserves local neighborhood probabilities in a non-linear low-dimensional manifold",
        "option_b": "PCA only operates on labeled data while t-SNE is strictly supervised",
        "option_c": "PCA is used solely for text data while t-SNE only applies to time series",
        "option_d": "t-SNE produces an explicit parametric projection matrix that can directly transform new unseen test points",
        "correct_option": "A",
        "explanation": "PCA maximizes global variance linearly. t-SNE minimizes the divergence between joint probabilities representing pairwise similarities, preserving local neighborhood structures."
    })
    questions.append({
        "id": "ML-A-29",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Ensemble Methods",
        "question_text": "In Stacking (Stacked Generalization), what is the role of the meta-learner?",
        "option_a": "To generate artificial training instances using interpolation",
        "option_b": "To learn how to optimally combine the out-of-fold prediction outputs of multiple diverse base models",
        "option_c": "To filter out features whose p-values exceed 0.05",
        "option_d": "To optimize the hyperparameter grid using Bayesian search",
        "correct_option": "B",
        "explanation": "Stacking trains a second-level meta-estimator on the cross-validated prediction probabilities/values produced by several diverse base learners."
    })
    questions.append({
        "id": "ML-A-30",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Evaluation Metrics",
        "question_text": "What is the relationship between the F1-Score and the Precision and Recall metrics?",
        "option_a": "F1-Score is the simple arithmetic mean of Precision and Recall",
        "option_b": "F1-Score is the geometric mean divided by the standard deviation",
        "option_c": "F1-Score is the harmonic mean of Precision and Recall: 2 * (Precision * Recall) / (Precision + Recall)",
        "option_d": "F1-Score equals Precision squared minus Recall",
        "correct_option": "C",
        "explanation": "F1-score is the harmonic mean of precision and recall, ensuring that if either metric approaches zero, the resulting F1-score drops sharply."
    })
    questions.append({
        "id": "ML-A-31",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Gradient Descent",
        "question_text": "What occurs if the learning rate in gradient descent is set excessively high?",
        "option_a": "The model converges in a single training step",
        "option_b": "The parameter updates may overshoot the minimum, causing loss values to oscillate or diverge to infinity",
        "option_c": "Gradients will permanently vanish to zero across all layers",
        "option_d": "The model will automatically revert to Ordinary Least Squares",
        "correct_option": "B",
        "explanation": "An excessively high learning rate causes parameter updates to step past valley minima, resulting in oscillating or exponentially exploding loss."
    })
    questions.append({
        "id": "ML-A-32",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Cross-Validation",
        "question_text": "When evaluating a time-series forecasting model, why is standard random K-Fold cross-validation invalid?",
        "option_a": "Random K-Fold introduces temporal data leakage where future information is used to predict past values",
        "option_b": "Time series data cannot be partitioned into numerical subsets",
        "option_c": "Random K-Fold alters the sampling frequency of timestamps",
        "option_d": "Time series models only support leave-one-out evaluation",
        "correct_option": "A",
        "explanation": "In time series, observations are temporally correlated. Standard random splitting causes look-ahead leakage (future training data predicting past validation samples)."
    })
    questions.append({
        "id": "ML-A-33",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Missing Data",
        "question_text": "What does data missing completely at random (MCAR) signify in statistical preprocessing?",
        "option_a": "The probability of missingness depends strongly on unobserved target values",
        "option_b": "The probability of a value being missing is completely independent of both observed and unobserved data",
        "option_c": "Missing values only occur in categorical features",
        "option_d": "The missingness is systematically linked to the magnitude of another input feature",
        "correct_option": "B",
        "explanation": "MCAR means the missingness mechanism is entirely random, depending neither on observed variables nor on the missing values themselves."
    })
    questions.append({
        "id": "ML-A-34",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Multiclass Classification",
        "question_text": "In One-vs-Rest (OvR) multiclass classification with K classes, how many distinct binary classifiers are trained?",
        "option_a": "K * (K - 1) / 2 classifiers",
        "option_b": "K classifiers, each trained to distinguish one specific class from all other K-1 classes combined",
        "option_c": "2^K classifiers",
        "option_d": "Exactly 1 classifier with K distinct output thresholds",
        "correct_option": "B",
        "explanation": "OvR trains K binary models, where the i-th classifier treats class i as positive and all remaining classes as negative."
    })

    # --- Advanced (16 Questions) ---
    questions.append({
        "id": "ML-A-35",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Optimization",
        "question_text": "What mathematical guarantee is established by the Karush-Kuhn-Tucker (KKT) conditions in constrained convex optimization for SVMs?",
        "option_a": "They provide necessary and sufficient first-order conditions for primal and dual optimal solutions",
        "option_b": "They guarantee that gradient descent will find global minima in non-convex multi-layer perceptrons",
        "option_c": "They ensure the Gram matrix is strictly diagonal",
        "option_d": "They eliminate all slack variables without loss of precision",
        "correct_option": "A",
        "explanation": "For convex problems satisfying Slater's condition, the KKT conditions (stationarity, primal feasibility, dual feasibility, complementary slackness) are necessary and sufficient for global optimality."
    })
    questions.append({
        "id": "ML-A-36",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Gradient Boosting",
        "question_text": "How does XGBoost incorporate second-order information into its objective function during split finding?",
        "option_a": "It uses second-order Taylor expansion of the loss function, taking both first derivatives (gradients) and second derivatives (hessians)",
        "option_b": "It computes the full inverse Hessian matrix at every tree node split",
        "option_c": "It uses the Runge-Kutta numerical integration scheme on residuals",
        "option_d": "It replaces greedy search with Nelder-Mead simplex optimization",
        "correct_option": "A",
        "explanation": "XGBoost applies a second-order Taylor expansion to the objective function: L(t) ≈ sum [ g_i * f_t(x_i) + 0.5 * h_i * f_t^2(x_i) ], where g_i and h_i are gradients and hessians."
    })
    questions.append({
        "id": "ML-A-37",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Regularization",
        "question_text": "In the context of Ridge Regression, how does the regularization parameter lambda modify the closed-form normal equation (X^T X)^(-1) X^T y?",
        "option_a": "It replaces X^T X with its singular value decomposition directly",
        "option_b": "It adds lambda * I to X^T X, ensuring the matrix is strictly positive definite and invertible even when X has collinear columns",
        "option_c": "It subtracts lambda from the target vector y",
        "option_d": "It scales the learning rate by 1 / lambda",
        "correct_option": "B",
        "explanation": "The Ridge closed-form estimator is beta = (X^T X + lambda * I)^(-1) X^T y. Adding lambda * I stabilizes ill-conditioned or singular X^T X matrices."
    })
    questions.append({
        "id": "ML-A-38",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Neural Networks",
        "question_text": "Why does the vanishing gradient problem occur when backpropagating through deep networks utilizing Sigmoid or Tanh activation functions?",
        "option_a": "The maximum first derivative of sigmoid is 0.25 (and tanh is 1.0); chaining many factors <= 0.25 causes gradients to exponentially decay toward zero",
        "option_b": "Matrix multiplication rounds weights down to the nearest integer",
        "option_c": "The loss function becomes strictly convex at deep layers",
        "option_d": "Backward passes require calculating the trace of the weight matrix",
        "correct_option": "A",
        "explanation": "Because sigma'(z) <= 0.25, multiplying many derivative terms across successive layers in the chain rule leads to exponential attenuation of the gradient at early layers."
    })
    questions.append({
        "id": "ML-A-39",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Neural Networks",
        "question_text": "What is the theoretical rationale behind He (Kaiming) weight initialization for networks using ReLU activation functions?",
        "option_a": "It scales weights uniformly between -1 and 1 to prevent dead neurons",
        "option_b": "It sets initial weights with variance 2/n_in to account for the fact that ReLU zeroes out approximately half of the incoming activations",
        "option_c": "It initializes all weights to 0.0 to prevent symmetry breaking",
        "option_d": "It sets the variance equal to 1 / (n_in + n_out)",
        "correct_option": "B",
        "explanation": "Because ReLU sets negative inputs to zero, the effective number of active units is halved. He initialization uses variance = 2 / n_in to preserve activation variance across forward layers."
    })
    questions.append({
        "id": "ML-A-40",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Clustering",
        "question_text": "What does a negative Silhouette coefficient for a specific data point signify?",
        "option_a": "The point is perfectly situated at the geometric center of its assigned cluster",
        "option_b": "The point is closer to members of a neighboring cluster than to points in its own assigned cluster, indicating likely misclustering",
        "option_c": "The point has zero distance to all points in the dataset",
        "option_d": "The dataset contains more features than observations",
        "correct_option": "B",
        "explanation": "Silhouette score s(i) = (b(i) - a(i)) / max(a(i), b(i)). If average intra-cluster distance a(i) exceeds nearest-cluster distance b(i), s(i) becomes negative, indicating improper assignment."
    })
    questions.append({
        "id": "ML-A-41",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Matrix Factorization",
        "question_text": "In Singular Value Decomposition (SVD) applied to a real data matrix X = U * Sigma * V^T, what do the columns of V represent?",
        "option_a": "The orthogonal eigenvectors of the sample covariance-like matrix X^T X (principal directions)",
        "option_b": "The coordinates of data points in the original basis",
        "option_c": "The eigenvalues of X X^T",
        "option_d": "The diagonal singular values arranged in ascending order",
        "correct_option": "A",
        "explanation": "In SVD, the right singular vectors (columns of V) are the eigenvectors of X^T X and correspond directly to the principal component axes of the data."
    })
    questions.append({
        "id": "ML-A-42",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "PAC Learning",
        "question_text": "What is the definition of Vapnik-Chervonenkis (VC) dimension of a hypothesis space H?",
        "option_a": "The minimum number of training iterations required for empirical risk minimization",
        "option_b": "The cardinality of the largest finite set of points that can be shattered (all possible labelings realized) by H",
        "option_c": "The number of non-zero parameters in a deep neural network",
        "option_d": "The ratio between empirical risk and true risk under 0-1 loss",
        "correct_option": "B",
        "explanation": "The VC dimension measures model capacity: it is the maximum number of points for which hypothesis space H can generate all 2^N possible binary labelings."
    })
    questions.append({
        "id": "ML-A-43",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Generative vs Discriminative",
        "question_text": "Under the conditional independence assumption of Naive Bayes, what does the model maximize when estimating parameters via Maximum Likelihood?",
        "option_a": "The margin between support vectors in dual space",
        "option_b": "The joint likelihood P(X, Y) = P(Y) * prod P(X_i | Y)",
        "option_c": "The conditional mutual information between continuous features",
        "option_d": "The residual sum of squares across validation folds",
        "correct_option": "B",
        "explanation": "Naive Bayes is a generative classifier modeling the joint distribution P(X, Y) by factoring feature conditional probabilities as prod P(X_i | Y) given class Y."
    })
    questions.append({
        "id": "ML-A-44",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Loss Functions",
        "question_text": "Why is Cross-Entropy loss strongly preferred over Mean Squared Error for training classification networks with softmax output layers?",
        "option_a": "MSE combined with softmax produces saturated gradients when predictions are confidently wrong, leading to slow learning or stalling",
        "option_b": "Cross-Entropy loss guarantees that all weight gradients remain non-negative",
        "option_c": "MSE cannot be computed for vectors with more than two dimensions",
        "option_d": "Cross-Entropy eliminates the necessity of backpropagation",
        "correct_option": "A",
        "explanation": "The derivative of softmax combined with cross-entropy simplifies to (p_i - y_i), producing linear gradient scaling even for large errors, whereas MSE introduces vanishing derivatives from softmax saturation."
    })
    questions.append({
        "id": "ML-A-45",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Kernel Methods",
        "question_text": "According to Mercer's Theorem, what condition must a continuous symmetric kernel function K(x, z) satisfy to be a valid inner product in some reproducing kernel Hilbert space (RKHS)?",
        "option_a": "Its Gram matrix must be positive semi-definite for all finite sets of points",
        "option_b": "The function must have strictly zero trace across all dimensions",
        "option_c": "The integral of K(x, z) over the domain must equal exactly 1.0",
        "option_d": "Its eigenvalues must alternate between positive and negative values",
        "correct_option": "A",
        "explanation": "Mercer's condition requires that the kernel is symmetric and that its associated Gram matrix is positive semi-definite, guaranteeing it corresponds to an inner product in a Hilbert space."
    })
    questions.append({
        "id": "ML-A-46",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Expectation-Maximization",
        "question_text": "What occurs during the M-step (Maximization step) of the Expectation-Maximization (EM) algorithm for Gaussian Mixture Models?",
        "option_a": "Posterior cluster probabilities (responsibilities) for each data point are evaluated using current parameters",
        "option_b": "Model parameters (means, covariances, and mixing coefficients) are re-estimated to maximize the expected complete-data log-likelihood",
        "option_c": "The number of mixture components K is systematically incremented",
        "option_d": "Data points with high variance are removed as noise",
        "correct_option": "B",
        "explanation": "In EM, the E-step computes the expectation of latent responsibilities; the M-step updates model parameters (means, covariance matrices, mixing weights) by maximizing the expected log-likelihood."
    })
    questions.append({
        "id": "ML-A-47",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Regularization",
        "question_text": "How does Dropout regularization affect neural network weight updates during backward training passes?",
        "option_a": "It randomly deactivates a fraction p of neurons during each forward pass, so incoming and outgoing gradients for those neurons are zeroed out",
        "option_b": "It clips weight norms to a fixed radius sphere",
        "option_c": "It forces weights to decay at an exponential rate proportional to the learning rate",
        "option_d": "It scales weight updates by the inverse Hessian matrix",
        "correct_option": "A",
        "explanation": "Dropout randomly sets a fraction p of node activations to zero during forward propagation, preventing co-adaptation of features. In backward passes, gradients only flow through active nodes."
    })
    questions.append({
        "id": "ML-A-48",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Optimization",
        "question_text": "What is the key mechanism in Weight Decay when applied to modern adaptive optimizers like Adam (as formalized in AdamW)?",
        "option_a": "Weight decay is decoupled from the gradient updates and directly subtracts a proportional fraction of the weight at each step",
        "option_b": "Weight decay multiplies gradients by the learning rate squared",
        "option_c": "Weight decay adds L1 absolute penalties to the moving average of gradients",
        "option_d": "Weight decay replaces second moment estimates with root mean squares",
        "correct_option": "A",
        "explanation": "In standard Adam with L2, weight decay is added to the gradient, getting distorted by moving variance rescaling. AdamW decouples weight decay, applying it directly to the parameter update."
    })
    questions.append({
        "id": "ML-A-49",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Feature Selection",
        "question_text": "What is the primary vulnerability of Recursive Feature Elimination (RFE) when working with highly collinear predictors?",
        "option_a": "RFE cannot run on continuous numerical datasets",
        "option_b": "Shared predictive importance is distributed unpredictably among collinear features, potentially leading to arbitrary elimination of valid predictors",
        "option_c": "RFE requires computing all 2^P feature subsets simultaneously",
        "option_d": "RFE forces the underlying estimator to assume zero residual variance",
        "correct_option": "B",
        "explanation": "Collinearity inflates parameter variance and causes tree-based or linear feature importances to be split arbitrarily among correlated features, causing RFE to drop informative variables prematurely."
    })
    questions.append({
        "id": "ML-A-50",
        "subject": "Machine Learning",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Information Theory",
        "question_text": "How is Mutual Information I(X; Y) between two random variables mathematically related to their individual and joint entropies?",
        "option_a": "I(X; Y) = H(X) + H(Y) - H(X, Y)",
        "option_b": "I(X; Y) = H(X, Y) - H(X) - H(Y)",
        "option_c": "I(X; Y) = H(X) / H(Y)",
        "option_d": "I(X; Y) = H(X | Y) + H(Y | X)",
        "correct_option": "A",
        "explanation": "Mutual information quantifies information shared between variables: I(X; Y) = H(X) + H(Y) - H(X, Y) = H(X) - H(X | Y), representing the reduction in uncertainty of X given knowledge of Y."
    })

    # ==========================================
    # SET B (50 Questions) - Equivalent difficulty & topic coverage
    # ==========================================

    # --- Beginner (16 Questions) ---
    questions.append({
        "id": "ML-B-01",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Supervised vs Unsupervised",
        "question_text": "Which of the following is an example of an unsupervised machine learning task?",
        "option_a": "Classifying incoming emails as spam or ham based on labeled training archives",
        "option_b": "Segmenting customer populations into behavioral groups using transaction patterns without pre-assigned labels",
        "option_c": "Forecasting tomorrow's ambient temperature using annotated sensor records",
        "option_d": "Detecting faces in photos using bounding box target coordinates",
        "correct_option": "B",
        "explanation": "Unsupervised learning discovers hidden patterns in unlabeled data. Grouping customers by purchasing patterns without target labels is classic clustering."
    })
    questions.append({
        "id": "ML-B-02",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Linear Regression",
        "question_text": "What does the slope coefficient (weight) in a simple univariate linear regression model represent?",
        "option_a": "The predicted change in the dependent variable for every one-unit increase in the independent variable",
        "option_b": "The total variance explained by all irrelevant features",
        "option_c": "The value of the dependent variable when the independent variable is zero",
        "option_d": "The probability that the residuals follow a uniform distribution",
        "correct_option": "A",
        "explanation": "In y = beta_0 + beta_1 * x, beta_1 represents the expected rate of change in target y per unit increase in input feature x."
    })
    questions.append({
        "id": "ML-B-03",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Logistic Regression",
        "question_text": "What is the standard classification decision boundary threshold applied to sigmoid output probabilities in binary logistic regression?",
        "option_a": "0.0",
        "option_b": "0.5",
        "option_c": "1.0",
        "option_d": "-1.0",
        "correct_option": "B",
        "explanation": "By convention, if P(y=1|x) >= 0.5, the sample is classified as class 1; otherwise, it is classified as class 0."
    })
    questions.append({
        "id": "ML-B-04",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Overfitting and Underfitting",
        "question_text": "What characterizes an underfitted machine learning model (high bias)?",
        "option_a": "Near-zero training error accompanied by high test error",
        "option_b": "High error on both the training set and the test set due to insufficient model capacity",
        "option_c": "The model has learned exact training noise perfectly",
        "option_d": "The model requires excessive memory to compute inference",
        "correct_option": "B",
        "explanation": "Underfitting occurs when a model is overly simplistic and cannot capture fundamental relationships in data, producing high errors across both training and testing datasets."
    })
    questions.append({
        "id": "ML-B-05",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Feature Scaling",
        "question_text": "What transformation does Min-Max Normalization perform on a continuous feature?",
        "option_a": "Rescales the feature values linearly into a fixed range, typically [0, 1]",
        "option_b": "Transforms the data to have a mean of 0 and standard deviation of 1",
        "option_c": "Replaces continuous values with their rank integers",
        "option_d": "Takes the natural log of all positive feature values",
        "correct_option": "A",
        "explanation": "Min-Max normalization uses (x - min) / (max - min) to linearly map feature values into the interval [0, 1]."
    })
    questions.append({
        "id": "ML-B-06",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Evaluation Metrics",
        "question_text": "In a spam detection system where flagging a legitimate email as spam (false positive) must be strictly avoided, which metric is most critical?",
        "option_a": "Precision",
        "option_b": "Recall",
        "option_c": "Log-loss",
        "option_d": "Mean Absolute Error",
        "correct_option": "A",
        "explanation": "Precision is TP / (TP + FP). When false positives are costly (e.g. sending a critical user email to spam), precision must be maximized."
    })
    questions.append({
        "id": "ML-B-07",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Evaluation Metrics",
        "question_text": "What does a 2x2 Confusion Matrix for binary classification summarize?",
        "option_a": "True Positives, False Positives, True Negatives, and False Negatives",
        "option_b": "The eigenvalues and eigenvectors of feature correlation",
        "option_c": "The execution times for train and test phases",
        "option_d": "The hyperparameter configurations evaluated during grid search",
        "correct_option": "A",
        "explanation": "A binary confusion matrix tabulates model predictions against ground truth: True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN)."
    })
    questions.append({
        "id": "ML-B-08",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "K-Means Clustering",
        "question_text": "What popular heuristic method is used to identify a suitable number of clusters (K) in K-Means?",
        "option_a": "The Elbow Method, examining where the reduction in inertia plateaus",
        "option_b": "The Backpropagation Stopping Rule",
        "option_c": "The Chi-Square Goodness-of-Fit test",
        "option_d": "The Levenberg-Marquardt algorithm",
        "correct_option": "A",
        "explanation": "The Elbow Method plots within-cluster sum of squares (inertia) against candidate values of K; the point where diminishing returns create an 'elbow' suggests an appropriate K."
    })
    questions.append({
        "id": "ML-B-09",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Decision Trees",
        "question_text": "Which information-theoretic measure is used in ID3 and C4.5 algorithms to select the best feature for node splitting?",
        "option_a": "Information Gain (based on Entropy reduction)",
        "option_b": "Minkowski Metric",
        "option_c": "Mean Absolute Percentage Error",
        "option_d": "Pearson Correlation Coefficient",
        "correct_option": "A",
        "explanation": "ID3 and C4.5 evaluate feature splits using Information Gain (or Gain Ratio), measuring the reduction in Shannon entropy achieved by partitioning on that feature."
    })
    questions.append({
        "id": "ML-B-10",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Data Preprocessing",
        "question_text": "When is Label Encoding appropriate compared to One-Hot Encoding?",
        "option_a": "When the categorical variable possesses an inherent natural ordering (e.g. Low, Medium, High)",
        "option_b": "When the target variable is continuous and unconstrained",
        "option_c": "When features have exactly zero variance",
        "option_d": "When categorical classes have no ordinal relationship whatsoever",
        "correct_option": "A",
        "explanation": "Label Encoding maps categories to integers (0, 1, 2...). It is suitable for ordinal features where numerical order reflects real relational order."
    })
    questions.append({
        "id": "ML-B-11",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Ensemble Methods",
        "question_text": "How does Random Forest introduce feature diversity among its constituent decision trees?",
        "option_a": "By randomly sampling a subset of features at each split node rather than evaluating all available features",
        "option_b": "By training each tree with a different loss function",
        "option_c": "By inverting the target labels for half of the trees",
        "option_d": "By converting all continuous features into principal components",
        "correct_option": "A",
        "explanation": "Random Forests decorrelate trees by evaluating only a random subset of m features (typically sqrt(p)) at each split candidate node."
    })
    questions.append({
        "id": "ML-B-12",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Cross-Validation",
        "question_text": "What is Stratified K-Fold cross-validation particularly designed to preserve?",
        "option_a": "The chronological order of temporal observations",
        "option_b": "The percentage representation of each target class across every individual fold",
        "option_c": "The exact memory address allocation of arrays",
        "option_d": "The sign of feature regression coefficients",
        "correct_option": "B",
        "explanation": "Stratified K-Fold ensures that each fold contains roughly the same percentage of samples of each target class as the complete dataset, critical for imbalanced classes."
    })
    questions.append({
        "id": "ML-B-13",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Neural Network Basics",
        "question_text": "What activation function is defined as f(x) = max(0, x)?",
        "option_a": "Rectified Linear Unit (ReLU)",
        "option_b": "Hyperbolic Tangent (Tanh)",
        "option_c": "Softmax",
        "option_d": "LeakyReLU",
        "correct_option": "A",
        "explanation": "ReLU is defined as max(0, x). It outputs zero for negative inputs and returns x unchanged for positive inputs, avoiding gradient saturation for positive activations."
    })
    questions.append({
        "id": "ML-B-14",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Hyperparameters vs Parameters",
        "question_text": "Which of the following is a model parameter learned during training?",
        "option_a": "The learning rate of an optimizer",
        "option_b": "The coefficients (weights) in a linear regression model",
        "option_c": "The number of hidden layers in an artificial neural network",
        "option_d": "The regularization penalty multiplier lambda in Lasso",
        "correct_option": "B",
        "explanation": "Model parameters are internal variables learned directly from training data (e.g. regression weights, neural net weights and biases)."
    })
    questions.append({
        "id": "ML-B-15",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Dimensionality Reduction",
        "question_text": "In Principal Component Analysis, how are the principal components ordered?",
        "option_a": "Alphabetically by initial feature names",
        "option_b": "In descending order of the amount of dataset variance they capture",
        "option_c": "By their correlation with the target variable",
        "option_d": "In ascending order of reconstruction error",
        "correct_option": "B",
        "explanation": "The first principal component accounts for the largest possible variance; each succeeding component accounts for the highest remaining variance under the constraint of orthogonality."
    })
    questions.append({
        "id": "ML-B-16",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Support Vector Machines",
        "question_text": "In a linear Support Vector Machine, what is the 'margin'?",
        "option_a": "The distance between the decision hyperplane and the closest data points from either class",
        "option_b": "The difference between training accuracy and test accuracy",
        "option_c": "The computational runtime difference between training and inference",
        "option_d": "The fraction of data points discarded as outliers",
        "correct_option": "A",
        "explanation": "The margin is the geometric distance between the separating decision hyperplane and the nearest training observations (support vectors) of any class."
    })

    # --- Intermediate (18 Questions) ---
    questions.append({
        "id": "ML-B-17",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Regularization",
        "question_text": "What is the key advantage of ElasticNet regression over standard Lasso (L1) regression?",
        "option_a": "ElasticNet combines L1 and L2 penalties, allowing it to select groups of correlated variables rather than picking one arbitrarily",
        "option_b": "ElasticNet eliminates the need for gradient descent by using an analytical exact matrix inversion",
        "option_c": "ElasticNet only applies regularization to negative feature values",
        "option_d": "ElasticNet prevents models from learning any non-zero intercept",
        "correct_option": "A",
        "explanation": "When features are highly correlated, Lasso tends to select one at random and drop others. ElasticNet combines L1 and L2 penalties, maintaining sparsity while grouping correlated predictors."
    })
    questions.append({
        "id": "ML-B-18",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Bias-Variance Tradeoff",
        "question_text": "How does reducing the regularization penalty lambda in a linear regression model affect its bias and variance?",
        "option_a": "It decreases bias and increases variance, making the model more flexible",
        "option_b": "It increases bias and decreases variance, making the model more rigid",
        "option_c": "It forces both bias and variance to drop to zero",
        "option_d": "It has no effect on model complexity",
        "correct_option": "A",
        "explanation": "Lower regularization allows model weights to adapt more closely to the training data, reducing bias but increasing model flexibility and variance."
    })
    questions.append({
        "id": "ML-B-19",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Gradient Boosting",
        "question_text": "What role does the 'learning rate' (shrinkage factor) play in Gradient Boosted Decision Trees?",
        "option_a": "It scales the contribution of each newly added tree, slowing down learning to prevent overfitting and improve generalization",
        "option_b": "It determines the maximum number of terminal leaves allowed per tree",
        "option_c": "It specifies the proportion of rows sampled without replacement",
        "option_d": "It sets the numerical tolerance for floating point matrix operations",
        "correct_option": "A",
        "explanation": "Shrinkage scales each tree's update by eta in (0, 1]. Smaller learning rates require more trees but substantially improve generalization."
    })
    questions.append({
        "id": "ML-B-20",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Optimization",
        "question_text": "How does Stochastic Gradient Descent (SGD) with Momentum overcome the oscillation problem in steep ravines of the loss surface?",
        "option_a": "It accumulates an exponentially decaying moving average of past gradients, accelerating descent along consistent directions while dampening oscillations",
        "option_b": "It computes the second derivative along all transverse coordinates at every step",
        "option_c": "It resets all weights to zero whenever loss increases",
        "option_d": "It randomly discards half of the parameter updates",
        "correct_option": "A",
        "explanation": "Momentum adds a fraction gamma of the previous update vector to the current step. In ravines, oscillating transverse directions cancel out while longitudinal updates accumulate."
    })
    questions.append({
        "id": "ML-B-21",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Loss Functions",
        "question_text": "What loss function is specifically minimized by Support Vector Machines to maximize the classification margin?",
        "option_a": "Hinge Loss: max(0, 1 - y * f(x))",
        "option_b": "Cross-Entropy Loss: -y * log(p)",
        "option_c": "Mean Absolute Percentage Error",
        "option_d": "Poisson Deviance",
        "correct_option": "A",
        "explanation": "SVMs optimize the soft-margin objective using Hinge Loss, max(0, 1 - y * f(x)), which assigns zero loss when predictions are correctly classified outside the margin."
    })
    questions.append({
        "id": "ML-B-22",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "ROC and AUC",
        "question_text": "What does an Area Under the ROC Curve (ROC-AUC) score of 0.5 indicate?",
        "option_a": "The model performs no better than random guessing",
        "option_b": "The model has achieved flawless class separation with zero false positives",
        "option_c": "The model misclassifies every single test observation",
        "option_d": "The dataset contains an equal 50/50 balance between positive and negative labels",
        "correct_option": "A",
        "explanation": "An ROC-AUC score of 0.5 corresponds to the diagonal chance line, meaning the model's ranking ability is equivalent to coin flipping."
    })
    questions.append({
        "id": "ML-B-23",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Clustering",
        "question_text": "In Agglomerative Hierarchical Clustering, what does 'Ward's linkage' criterion minimize at each merge step?",
        "option_a": "The increase in total within-cluster variance",
        "option_b": "The maximum Euclidean distance between any pair of points in the two clusters",
        "option_c": "The correlation between cluster centroid coordinates",
        "option_d": "The total number of remaining leaf nodes",
        "correct_option": "A",
        "explanation": "Ward's hierarchical clustering criterion merges pairs of clusters that minimize the increase in total within-cluster sum of squared errors."
    })
    questions.append({
        "id": "ML-B-24",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Feature Engineering",
        "question_text": "What is the primary objective of applying a Box-Cox transformation to continuous input features?",
        "option_a": "To transform non-normal, skewed positive distributions into an approximately normal (Gaussian) distribution",
        "option_b": "To encode categorical strings into dense integer representations",
        "option_c": "To reduce the dimensionality of the feature space to two axes",
        "option_d": "To randomly mask features to prevent overfitting",
        "correct_option": "A",
        "explanation": "The Box-Cox power transform stabilizes variance and normalizes strictly positive, skewed continuous variables toward a Gaussian distribution."
    })
    questions.append({
        "id": "ML-B-25",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Neural Networks",
        "question_text": "What is the 'dying ReLU' problem observed in deep neural networks?",
        "option_a": "Neurons become trapped in the negative regime where activation and gradient are permanently zero, preventing further weight updates",
        "option_b": "Network weights grow exponentially until floating point overflow occurs",
        "option_c": "The output probabilities sum to values greater than 1.0",
        "option_d": "The learning rate decays to zero after the first epoch",
        "correct_option": "A",
        "explanation": "If a large gradient updates ReLU weights such that the neuron produces negative inputs for all data points, its activation and derivative become zero, rendering the neuron permanently inactive."
    })
    questions.append({
        "id": "ML-B-26",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Support Vector Machines",
        "question_text": "What is the function of the soft-margin penalty parameter C in Support Vector Classification?",
        "option_a": "It governs the trade-off between maximizing the margin width and penalizing margin slack violations",
        "option_b": "It specifies the degree of polynomial kernel functions",
        "option_c": "It sets the convergence threshold for the dual solver",
        "option_d": "It determines the number of nearest neighbors evaluated",
        "correct_option": "A",
        "explanation": "The hyperparameter C balances margin maximization against classification errors: high C heavily penalizes misclassifications (narrow margin), while low C tolerates violations (wider margin)."
    })
    questions.append({
        "id": "ML-B-27",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Decision Trees",
        "question_text": "What is the purpose of cost-complexity pruning (minimal cost-complexity alpha) in decision trees?",
        "option_a": "To prune subtrees whose contribution to impurity reduction does not justify the penalty alpha per additional leaf node",
        "option_b": "To replace all split thresholds with median continuous values",
        "option_c": "To convert decision trees into logistic regression models",
        "option_d": "To expand every branch until all leaves are completely pure",
        "correct_option": "A",
        "explanation": "Cost-complexity pruning minimizes R_alpha(T) = R(T) + alpha * |T|, trimming subtrees that provide negligible impurity reduction relative to tree complexity."
    })
    questions.append({
        "id": "ML-B-28",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Dimensionality Reduction",
        "question_text": "Why should PCA projection parameters (fit transformation) be computed strictly on the training set and not the combined train + test dataset?",
        "option_a": "Fitting PCA on test data constitutes data snooping / data leakage, biasing validation performance",
        "option_b": "PCA cannot mathematically compute covariance matrices on unseen data",
        "option_c": "Test sets never contain numeric features",
        "option_d": "Principal components cannot be projected onto arrays of different lengths",
        "correct_option": "A",
        "explanation": "Computing PCA parameters on the test set leaks distribution and variance information from the evaluation data into the modeling pipeline."
    })
    questions.append({
        "id": "ML-B-29",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Ensemble Methods",
        "question_text": "In AdaBoost, how are observation sample weights updated after each sequential base learner is trained?",
        "option_a": "Weights of misclassified observations are increased, forcing subsequent learners to focus on difficult instances",
        "option_b": "Weights of all samples are reset to random values between 0 and 1",
        "option_c": "Weights of correctly classified samples are multiplied by the learning rate squared",
        "option_d": "Misclassified samples are removed from future training iterations",
        "correct_option": "A",
        "explanation": "AdaBoost increases weights on misclassified training instances, compelling the next sequential weak classifier to focus on previously erroneous cases."
    })
    questions.append({
        "id": "ML-B-30",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Evaluation Metrics",
        "question_text": "When comparing models on a dataset with severe class imbalance (e.g. 1 positive per 1,000 negatives), why is the Precision-Recall (PR) curve preferred over the ROC curve?",
        "option_a": "ROC's False Positive Rate denominator includes the vast true negative majority, making large increases in false positives appear misleadingly small",
        "option_b": "Precision-Recall curves are restricted to multiclass problems only",
        "option_c": "ROC curves cannot be plotted if AUC exceeds 0.8",
        "option_d": "PR curves ignore the true positive count entirely",
        "correct_option": "A",
        "explanation": "In extreme class imbalance, TN is huge, so FPR = FP / (FP + TN) stays tiny even with many false positives. PR curves focus on TP, FP, and FN without being masked by TN."
    })
    questions.append({
        "id": "ML-B-31",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Gradient Descent",
        "question_text": "What is the primary computational benefit of Mini-Batch Gradient Descent over full-batch gradient descent?",
        "option_a": "It leverages vectorized GPU hardware efficiency while providing frequent parameter updates without loading entire massive datasets into memory",
        "option_b": "It eliminates the need for learning rate hyperparameter tuning",
        "option_c": "It guarantees that loss decreases monotonically after every single update",
        "option_d": "It computes second-order derivatives analytically without approximation",
        "correct_option": "A",
        "explanation": "Mini-batch SGD combines vectorization throughput on GPUs with frequent parameter updates, avoiding memory limits associated with full-batch processing on massive datasets."
    })
    questions.append({
        "id": "ML-B-32",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Cross-Validation",
        "question_text": "What is Leave-One-Out Cross-Validation (LOOCV)?",
        "option_a": "A special case of K-Fold cross-validation where K equals the total number of observations N in the dataset",
        "option_b": "Cross-validation where one feature is omitted per iteration to evaluate feature importance",
        "option_c": "Cross-validation that reserves 50% of the data for testing",
        "option_d": "An evaluation protocol that ignores the single largest outlier",
        "correct_option": "A",
        "explanation": "LOOCV is K-Fold with K = N: in each of N iterations, a single sample serves as the test set while the remaining N-1 samples train the model."
    })
    questions.append({
        "id": "ML-B-33",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Missing Data",
        "question_text": "What is KNN Imputation in data preprocessing?",
        "option_a": "Imputing missing feature values by calculating the weighted average or mode of the K most similar complete observations",
        "option_b": "Replacing all missing entries with the global feature mean",
        "option_c": "Dropping any row containing more than K missing entries",
        "option_d": "Converting missing numerical values into negative infinity",
        "correct_option": "A",
        "explanation": "KNN imputation identifies the K nearest neighbors of an incomplete row using available features, imputing missing values via distance-weighted neighbor averaging."
    })
    questions.append({
        "id": "ML-B-34",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Multiclass Classification",
        "question_text": "In One-vs-One (OvO) multiclass classification with K classes, how many distinct binary classifiers are trained?",
        "option_a": "K * (K - 1) / 2 classifiers",
        "option_b": "K classifiers",
        "option_c": "K^2 classifiers",
        "option_d": "2 * K classifiers",
        "correct_option": "A",
        "explanation": "OvO trains a separate binary classifier for every unique pair of classes, resulting in K * (K - 1) / 2 distinct models."
    })

    # --- Advanced (16 Questions) ---
    questions.append({
        "id": "ML-B-35",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Optimization",
        "question_text": "In the dual formulation of Support Vector Machines, what key property allows non-linear classification without explicitly calculating transformed coordinates?",
        "option_a": "All feature vectors appear solely within dot products (x_i dot x_j), enabling direct substitution with Mercer kernel functions",
        "option_b": "The dual problem eliminates all Lagrange multipliers",
        "option_c": "The slack variables are guaranteed to sum to zero",
        "option_d": "The decision boundary becomes independent of the support vectors",
        "correct_option": "A",
        "explanation": "The dual SVM objective depends exclusively on pairwise dot products between samples, allowing kernel functions K(x_i, x_j) to compute inner products in high-dimensional feature spaces."
    })
    questions.append({
        "id": "ML-B-36",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Gradient Boosting",
        "question_text": "What algorithmic innovation allows LightGBM to train significantly faster than traditional GBDT implementations on massive datasets?",
        "option_a": "Histogram-based binning combined with Gradient-based One-Side Sampling (GOSS) and Exclusive Feature Bundling (EFB)",
        "option_b": "Analytical computation of leaf splits using closed-form Matrix Inversion",
        "option_c": "Restricting all trees to depth 1 (decision stumps only)",
        "option_d": "Replacing tree splits with random hyperplanes",
        "correct_option": "A",
        "explanation": "LightGBM discretizes continuous features into histogram bins, uses GOSS to retain instances with large gradients while sub-sampling small-gradient instances, and bundles mutually exclusive features (EFB)."
    })
    questions.append({
        "id": "ML-B-37",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Regularization",
        "question_text": "From a Bayesian perspective, what prior distribution over regression coefficients corresponds to L2 (Ridge) and L1 (Lasso) regularization respectively?",
        "option_a": "Ridge corresponds to a zero-mean Gaussian prior; Lasso corresponds to a zero-mean Laplace (double exponential) prior",
        "option_b": "Ridge corresponds to a Uniform prior; Lasso corresponds to a Beta prior",
        "option_c": "Ridge corresponds to a Cauchy prior; Lasso corresponds to a Dirichlet prior",
        "option_d": "Both correspond to identical Poisson priors",
        "correct_option": "A",
        "explanation": "Maximum A Posteriori (MAP) estimation with a Gaussian prior on weights yields L2 regularization, while a Laplace prior (with its sharp peak at zero) yields L1 regularization."
    })
    questions.append({
        "id": "ML-B-38",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Neural Networks",
        "question_text": "What structural mechanism in Residual Networks (ResNets) solves the degradation problem in very deep architectures?",
        "option_a": "Identity shortcut connections that allow gradients to flow directly through the computational graph without attenuation: F(x) + x",
        "option_b": "Replacing all non-linear activation functions with identity mappings",
        "option_c": "Computing forward passes purely in frequency space using FFT",
        "option_d": "Eliminating all convolutional pooling operations",
        "correct_option": "A",
        "explanation": "Skip/residual connections reformulate layers to learn residual mappings F(x) = H(x) - x, allowing gradients to propagate directly through identity additions during backpropagation."
    })
    questions.append({
        "id": "ML-B-39",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Neural Networks",
        "question_text": "What is the primary benefit of the Gaussian Error Linear Unit (GELU) activation function widely used in Transformer architectures?",
        "option_a": "It weights inputs by their value according to the standard normal cumulative distribution, providing a smooth non-monotonic probabilistic gating",
        "option_b": "It forces half of all parameter gradients to be strictly negative",
        "option_c": "It bounds activations between -1 and +1 like tanh",
        "option_d": "It requires no floating-point multiplications",
        "correct_option": "A",
        "explanation": "GELU, defined as x * Phi(x), smoothly gates activations based on a Gaussian distribution, offering non-monotonicity and probabilistic scaling favored in modern LLMs and Transformers."
    })
    questions.append({
        "id": "ML-B-40",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Clustering",
        "question_text": "In Gaussian Mixture Models, how is a sample's soft assignment ('responsibility') gamma_ik calculated in the E-step?",
        "option_a": "gamma_ik = [ pi_k * N(x_i | mu_k, Sigma_k) ] / sum_j [ pi_j * N(x_i | mu_j, Sigma_j) ]",
        "option_b": "gamma_ik = Euclidean distance from x_i to mu_k divided by the total dataset variance",
        "option_c": "gamma_ik = 1 if x_i is closest to mu_k, else 0",
        "option_d": "gamma_ik = the log determinant of the sample covariance matrix",
        "correct_option": "A",
        "explanation": "The E-step computes the posterior probability (responsibility) that Gaussian component k generated data point x_i using Bayes' rule on the mixture components."
    })
    questions.append({
        "id": "ML-B-41",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Matrix Factorization",
        "question_text": "In Low-Rank Matrix Approximation (Eckart-Young-Mirsky Theorem), what matrix achieves the best rank-k approximation of matrix A under the Frobenius norm?",
        "option_a": "The truncated SVD matrix A_k = U_k * Sigma_k * V_k^T obtained by retaining the top k largest singular values",
        "option_b": "The diagonal elements of matrix A with off-diagonals zeroed out",
        "option_c": "The QR decomposition matrix Q_k",
        "option_d": "The Cholesky factor L_k * L_k^T",
        "correct_option": "A",
        "explanation": "The Eckart-Young-Mirsky theorem proves that retaining the k largest singular values and singular vectors in SVD yields the optimal rank-k approximation under both spectral and Frobenius norms."
    })
    questions.append({
        "id": "ML-B-42",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "PAC Learning",
        "question_text": "What does Probably Approximately Correct (PAC) learnability formally bound for a learning algorithm?",
        "option_a": "With probability at least 1 - delta, the generalization error of the output hypothesis is bounded by at most epsilon given polynomial sample size",
        "option_b": "The total number of floating-point operations required to train a deep neural net",
        "option_c": "The maximum memory footprint occupied by support vectors",
        "option_d": "The likelihood of encountering null values during cross-validation",
        "correct_option": "A",
        "explanation": "PAC learning establishes that with high probability (1 - delta), the true generalization error of the learned hypothesis is at most epsilon, given a polynomial sample complexity."
    })
    questions.append({
        "id": "ML-B-43",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Generative vs Discriminative",
        "question_text": "How do Generative and Discriminative classifiers fundamentally differ in what mathematical probability they model directly?",
        "option_a": "Discriminative models directly model the posterior P(Y | X), while generative models model the joint distribution P(X, Y) = P(X | Y)P(Y)",
        "option_b": "Discriminative models can only output continuous numbers, while generative models output binary booleans",
        "option_c": "Generative models can only be evaluated using accuracy, whereas discriminative models use F1-score",
        "option_d": "Discriminative models require prior probabilities P(Y), while generative models do not",
        "correct_option": "A",
        "explanation": "Discriminative classifiers (e.g. Logistic Regression, SVM) model P(Y | X) directly. Generative models (e.g. Naive Bayes, GMM) model P(X, Y) to capture data distribution."
    })
    questions.append({
        "id": "ML-B-44",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Loss Functions",
        "question_text": "What is the mathematical formulation of Binary Cross-Entropy Loss for a single sample with true label y in {0, 1} and predicted probability p?",
        "option_a": "L = - [ y * log(p) + (1 - y) * log(1 - p) ]",
        "option_b": "L = 0.5 * (y - p)^2",
        "option_c": "L = |y - p| / max(y, p)",
        "option_d": "L = log(1 + exp(-y * p))",
        "correct_option": "A",
        "explanation": "Binary Cross-Entropy (log-loss) is - [ y * log(p) + (1 - y) * log(1 - p) ]. It heavily penalizes confident predictions that deviate from ground-truth labels."
    })
    questions.append({
        "id": "ML-B-45",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Kernel Methods",
        "question_text": "What is the mathematical formula for the Gaussian Radial Basis Function (RBF) kernel between two vectors x and z?",
        "option_a": "K(x, z) = exp(-gamma * ||x - z||^2)",
        "option_b": "K(x, z) = (x dot z + c)^d",
        "option_c": "K(x, z) = tanh(alpha * x dot z + c)",
        "option_d": "K(x, z) = ||x - z|| / (1 + ||x + z||)",
        "correct_option": "A",
        "explanation": "The Gaussian RBF kernel is defined as K(x, z) = exp(-gamma * ||x - z||^2), where gamma is a positive hyperparameter governing the bell curve width."
    })
    questions.append({
        "id": "ML-B-46",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Expectation-Maximization",
        "question_text": "Why does the Expectation-Maximization (EM) algorithm guarantee that the observed data log-likelihood is monotonically non-decreasing at each iteration?",
        "option_a": "Because each EM iteration maximizes a tight lower bound (via Jensen's inequality) on the marginal log-likelihood",
        "option_b": "Because EM solves the primal and dual constraints via interior point methods",
        "option_c": "Because EM enforces strict orthogonality among covariance matrices",
        "option_d": "Because EM computes the exact global minimum in one step",
        "correct_option": "A",
        "explanation": "EM maximizes the Evidence Lower Bound (ELBO) on the marginal log-likelihood. By Jensen's inequality, improving the ELBO guarantees that the true log-likelihood never decreases."
    })
    questions.append({
        "id": "ML-B-47",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Regularization",
        "question_text": "In deep networks, what is 'Inverted Dropout' and why is it standard practice in modern frameworks like PyTorch and TensorFlow?",
        "option_a": "Activations of retained neurons are scaled by 1/(1-p) during training, leaving inference passes unscaled without modification",
        "option_b": "Dropout is applied to backward gradients rather than forward activations",
        "option_c": "Dropout is disabled during the first 10 training epochs",
        "option_d": "Dropout scales weights by multiplying by the learning rate",
        "correct_option": "A",
        "explanation": "Inverted Dropout scales active units by 1/(1-p) during forward training passes. This keeps expected layer outputs identical between training and testing, requiring no changes at inference."
    })
    questions.append({
        "id": "ML-B-48",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Optimization",
        "question_text": "How does the RMSprop optimizer adjust learning rates compared to standard AdaGrad?",
        "option_a": "RMSprop replaces AdaGrad's ever-accumulating sum of squared gradients with an exponentially decaying moving average, preventing the learning rate from vanishing prematurely",
        "option_b": "RMSprop removes momentum entirely and replaces it with line search",
        "option_c": "RMSprop computes the exact Hessian diagonal",
        "option_d": "RMSprop restricts weight updates to prime numbers of epochs",
        "correct_option": "A",
        "explanation": "AdaGrad accumulates all past squared gradients, causing learning rates to decay to zero. RMSprop uses an exponential moving average of squared gradients, resolving the premature stopping issue."
    })
    questions.append({
        "id": "ML-B-49",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Feature Selection",
        "question_text": "What is the theoretical principle behind Minimum Redundancy Maximum Relevance (mRMR) feature selection?",
        "option_a": "It selects features with high mutual information with the target class while penalizing features that have high mutual information with already selected features",
        "option_b": "It trains K-Means on features and selects cluster centers",
        "option_c": "It removes all features with non-zero p-values in a t-test",
        "option_d": "It scales features by their variance and drops top 10%",
        "correct_option": "A",
        "explanation": "mRMR optimizes two criteria simultaneously: maximizing relevance (mutual information with the target class) while minimizing redundancy (mutual information among selected predictors)."
    })
    questions.append({
        "id": "ML-B-50",
        "subject": "Machine Learning",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Information Theory",
        "question_text": "What is Kullback-Leibler (KL) Divergence D_KL(P || Q) measuring between two probability distributions P and Q?",
        "option_a": "The asymmetric measure of information lost when distribution Q is used to approximate the true distribution P",
        "option_b": "The symmetric Euclidean distance between mean parameters of P and Q",
        "option_c": "The cosine angle between probability vectors P and Q",
        "option_d": "The correlation coefficient of two independent random variables",
        "correct_option": "A",
        "explanation": "KL divergence D_KL(P || Q) = sum P(x) * log(P(x) / Q(x)) is an asymmetric information-theoretic metric quantifying the extra bits required to encode samples from P using code optimized for Q."
    })

    return questions

