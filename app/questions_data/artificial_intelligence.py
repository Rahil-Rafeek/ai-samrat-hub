"""
Artificial Intelligence Question Bank: 100 Approved MCQs (50 Set A, 50 Set B)
Balanced difficulty: 16 Beginner, 18 Intermediate, 16 Advanced per set.
Equivalent topic coverage across both sets.
"""

def get_artificial_intelligence_questions():
    questions = []

    # ==========================================
    # SET A (50 Questions)
    # ==========================================

    # --- Beginner (16 Questions) ---
    questions.append({
        "id": "AI-A-01",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Search Algorithms",
        "question_text": "Which search strategy expands the shallowest unexpanded frontier node first and is guaranteed to find the shortest path in unweighted graphs?",
        "option_a": "Breadth-First Search (BFS)",
        "option_b": "Depth-First Search (DFS)",
        "option_c": "Depth-Limited Search",
        "option_d": "Greedy Best-First Search",
        "correct_option": "A",
        "explanation": "Breadth-First Search (BFS) explores nodes level-by-level using a FIFO queue, guaranteeing the shortest path in unweighted state graphs."
    })
    questions.append({
        "id": "AI-A-02",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Turing Test & Agent Basics",
        "question_text": "What is the primary objective of the classic Turing Test proposed by Alan Turing?",
        "option_a": "To test whether an interrogator can distinguish between human and machine responses via natural language conversation",
        "option_b": "To calculate the floating point operations per second of a digital processor",
        "option_c": "To prove that an algorithm can solve NP-complete mathematical theorems",
        "option_d": "To measure the memory capacity of an artificial neural network",
        "correct_option": "A",
        "explanation": "The Turing Test evaluates machine intelligence by assessing whether a human judge can reliably differentiate between text-based responses from a computer and a human."
    })
    questions.append({
        "id": "AI-A-03",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Heuristic Search",
        "question_text": "In the A* search algorithm evaluation function f(n) = g(n) + h(n), what does g(n) represent?",
        "option_a": "The actual cost incurred to reach node n from the initial starting node",
        "option_b": "The estimated heuristic cost from node n to the nearest goal state",
        "option_c": "The branching factor of the current search tree level",
        "option_d": "The total depth limit permitted for tree exploration",
        "correct_option": "A",
        "explanation": "In A*, g(n) is the exact path cost accumulated from the start node to node n, while h(n) is the heuristic estimate from node n to the goal."
    })
    questions.append({
        "id": "AI-A-04",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Adversarial Search",
        "question_text": "In a zero-sum two-player game, what is the goal of the 'MAX' player in the Minimax algorithm?",
        "option_a": "To choose a move that maximizes their payoff assuming the MIN player acts to minimize it",
        "option_b": "To force the MIN player to choose a random move",
        "option_c": "To minimize the total number of turns played",
        "option_d": "To maximize the branching factor of the game tree",
        "correct_option": "A",
        "explanation": "In zero-sum games, MAX seeks to maximize the terminal utility value under the assumption that MIN plays optimally to minimize MAX's payoff."
    })
    questions.append({
        "id": "AI-A-05",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Knowledge Representation",
        "question_text": "In Propositional Logic, what does the logical connective implication (P -> Q) evaluate to when P is false and Q is true?",
        "option_a": "True",
        "option_b": "False",
        "option_c": "Undefined",
        "option_d": "Contradiction",
        "correct_option": "A",
        "explanation": "In classical logic, material implication (P -> Q) is equivalent to (not P or Q). When P is false, the implication is vacuously true regardless of Q."
    })
    questions.append({
        "id": "AI-A-06",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Expert Systems",
        "question_text": "What are the two primary structural components of a classical Rule-Based Expert System?",
        "option_a": "Knowledge Base (rules and facts) and an Inference Engine (reasoning mechanism)",
        "option_b": "Convolutional filter bank and pooling layers",
        "option_c": "Recurrent memory cell and gradient backpropagator",
        "option_d": "Gram matrix and dual quadratic solver",
        "correct_option": "A",
        "explanation": "A rule-based expert system separates domain expertise contained in the Knowledge Base (IF-THEN rules) from the reasoning logic within the Inference Engine."
    })
    questions.append({
        "id": "AI-A-07",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Reinforcement Learning Basics",
        "question_text": "What is the primary reward signal used for in Reinforcement Learning?",
        "option_a": "To provide scalar evaluative feedback indicating how desirable an agent's recent action was",
        "option_b": "To provide the exact derivative of the policy network",
        "option_c": "To convert continuous states into discrete symbols",
        "option_d": "To label input observations with ground truth classification tags",
        "correct_option": "A",
        "explanation": "In RL, the scalar reward from the environment guides the agent: the objective is to maximize cumulative expected discounted rewards over time."
    })
    questions.append({
        "id": "AI-A-08",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "NLP Basics",
        "question_text": "What is the process of breaking down a continuous body of text into individual words, phrases, or symbols called?",
        "option_a": "Tokenization",
        "option_b": "Stemming",
        "option_c": "Lemmatization",
        "option_d": "Vectorization",
        "correct_option": "A",
        "explanation": "Tokenization segments raw text strings into discrete atomic units (tokens) such as words, subwords, or punctuation marks for processing."
    })
    questions.append({
        "id": "AI-A-09",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Computer Vision Basics",
        "question_text": "What is the primary role of a Convolutional Layer in a Convolutional Neural Network (CNN)?",
        "option_a": "To extract spatial feature maps by sliding learnable kernel filters across the input image",
        "option_b": "To average all pixel values into a single scalar",
        "option_c": "To compute the singular value decomposition of color channels",
        "option_d": "To store human conversational history",
        "correct_option": "A",
        "explanation": "Convolutional layers apply parameterized spatial filters across image regions, extracting localized patterns like edges, textures, and higher-order motifs."
    })
    questions.append({
        "id": "AI-A-10",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Generative AI Basics",
        "question_text": "In a Generative Adversarial Network (GAN), what are the two competing neural network architectures called?",
        "option_a": "The Generator and the Discriminator",
        "option_b": "The Encoder and the Decoder",
        "option_c": "The Actor and the Critic",
        "option_d": "The Policy and the Value Network",
        "correct_option": "A",
        "explanation": "A GAN pits a Generator (which synthesizes realistic data) against a Discriminator (which distinguishes real training data from generated fakes)."
    })
    questions.append({
        "id": "AI-A-11",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Constraint Satisfaction",
        "question_text": "Which of the following problems is classic formulation of a Constraint Satisfaction Problem (CSP)?",
        "option_a": "Map Coloring where neighboring regions must not share identical colors",
        "option_b": "Minimizing Ordinary Least Squares residuals",
        "option_c": "Calculating PageRank stationary distributions",
        "option_d": "Computing gradient norm clipping",
        "correct_option": "A",
        "explanation": "Map coloring consists of variables (regions), domains (colors), and constraints (adjacent regions must have different colors), defining a standard CSP."
    })
    questions.append({
        "id": "AI-A-12",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Search Algorithms",
        "question_text": "What is the main limitation of Depth-First Search (DFS) in an infinite state space?",
        "option_a": "It can get trapped exploring an infinite non-goal branch and never terminate",
        "option_b": "It consumes exponential memory proportional to branching factor b raised to depth d",
        "option_c": "It cannot evaluate heuristic cost functions",
        "option_d": "It requires the graph to be fully directed and acyclic",
        "correct_option": "A",
        "explanation": "DFS is not complete in infinite state spaces or graphs with cycles, as it can dive indefinitely down an infinite branch without backtracking to find the goal."
    })
    questions.append({
        "id": "AI-A-13",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "AI Concepts",
        "question_text": "What distinction characterizes 'Weak AI' (Narrow AI) compared to 'Strong AI' (Artificial General Intelligence)?",
        "option_a": "Weak AI is designed and optimized to perform specific dedicated tasks, whereas Strong AI exhibits human-like generalized cognition across domains",
        "option_b": "Weak AI runs on CPUs while Strong AI requires quantum computers",
        "option_c": "Weak AI cannot utilize neural networks",
        "option_d": "Weak AI requires human supervision for every single inference query",
        "correct_option": "A",
        "explanation": "Narrow (Weak) AI specializes in specific domains (e.g., chess, speech recognition, image classification), while Strong AI denotes general adaptability across any intellectual task."
    })
    questions.append({
        "id": "AI-A-14",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "NLP Basics",
        "question_text": "What is the purpose of Stop Word removal in traditional natural language processing pipelines?",
        "option_a": "To filter out highly frequent words (e.g. 'the', 'is', 'at') that convey minimal unique semantic information",
        "option_b": "To eliminate misspelled tokens from text archives",
        "option_c": "To convert uppercase letters into lowercase ASCII",
        "option_d": "To identify sentence end punctuation markers",
        "correct_option": "A",
        "explanation": "Stop words are frequent functional words that carry little domain-specific discriminatory value for tasks like TF-IDF topic classification."
    })
    questions.append({
        "id": "AI-A-15",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Ethics & Safety",
        "question_text": "In the context of Large Language Models, what does 'hallucination' refer to?",
        "option_a": "Generating grammatically fluent and convincing statements that are factually inaccurate or ungrounded in real data",
        "option_b": "Crashing the GPU memory buffer due to excessive sequence lengths",
        "option_c": "Translating text between languages without grammatical syntax rules",
        "option_d": "Compressing vocabulary embeddings into binary bits",
        "correct_option": "A",
        "explanation": "Hallucination describes LLM behavior where the model fabricates false, ungrounded assertions while presenting them with high confidence and natural fluency."
    })
    questions.append({
        "id": "AI-A-16",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Beginner",
        "topic": "Computer Vision Basics",
        "question_text": "What is the primary role of Max Pooling in convolutional networks?",
        "option_a": "To reduce spatial dimensions (downsample), providing spatial translation invariance and lowering computation",
        "option_b": "To initialize filter weights using Gaussian noise",
        "option_c": "To increase the channel depth of feature maps",
        "option_d": "To convert RGB channels into grayscale",
        "correct_option": "A",
        "explanation": "Max pooling extracts the maximum value in local spatial windows, progressively reducing spatial resolution, controlling parameter count, and imparting slight translation invariance."
    })

    # --- Intermediate (18 Questions) ---
    questions.append({
        "id": "AI-A-17",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Search Algorithms",
        "question_text": "What condition must a heuristic h(n) satisfy to guarantee that tree-search A* is optimal?",
        "option_a": "Admissibility: h(n) must never overestimate the true minimum cost to reach the goal",
        "option_b": "Linearity: h(n) must be directly proportional to tree depth",
        "option_c": "Symmetry: h(a, b) must equal h(b, a)",
        "option_d": "Convexity: h''(n) must be strictly non-negative",
        "correct_option": "A",
        "explanation": "A heuristic is admissible if h(n) <= h*(n) for all nodes. In tree search, admissibility guarantees that A* will return an optimal solution."
    })
    questions.append({
        "id": "AI-A-18",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Adversarial Search",
        "question_text": "How does Alpha-Beta pruning optimize the standard Minimax game tree exploration?",
        "option_a": "By pruning subtrees that are mathematically proven to be worse than an already examined alternative for the current player",
        "option_b": "By restricting search exclusively to depth 1",
        "option_c": "By replacing evaluation functions with random Monte Carlo rollouts",
        "option_d": "By converting zero-sum utilities into cooperative rewards",
        "correct_option": "A",
        "explanation": "Alpha-Beta pruning tracks alpha (best score MAX can guarantee) and beta (best score MIN can guarantee), safely terminating branches whenever alpha >= beta."
    })
    questions.append({
        "id": "AI-A-19",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Logic and Inference",
        "question_text": "What is the resolution inference rule in Propositional Logic when applied to clauses (A or B) and (not B or C)?",
        "option_a": "A or C (the resolvent)",
        "option_b": "B and not B",
        "option_c": "A and C",
        "option_d": "not A or not C",
        "correct_option": "A",
        "explanation": "Resolution combines two clauses containing complementary literals (B and not B) to derive the resolvent clause (A or C)."
    })
    questions.append({
        "id": "AI-A-20",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Markov Decision Processes",
        "question_text": "What does the Markov property state regarding state transitions in a Markov Decision Process (MDP)?",
        "option_a": "The transition probability to the next state S_{t+1} depends solely on current state S_t and action A_t, independent of prior history",
        "option_b": "All states must have identical reward values",
        "option_c": "The policy must be stochastic at every decision step",
        "option_d": "Actions are executed with zero latency",
        "correct_option": "A",
        "explanation": "The Markov property states that the future is conditionally independent of the past given the present: P(S_{t+1} | S_t, A_t, S_{t-1}, A_{t-1}, ...) = P(S_{t+1} | S_t, A_t)."
    })
    questions.append({
        "id": "AI-A-21",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Reinforcement Learning",
        "question_text": "Why is Q-Learning classified as an 'off-policy' reinforcement learning algorithm?",
        "option_a": "It updates the Q-function using the greedy maximum action for the next state, regardless of the action selected by the behavior exploration policy",
        "option_b": "It does not require discount factors gamma",
        "option_c": "It can only be trained offline without interacting with an environment",
        "option_d": "It updates policy parameters without computing action values",
        "correct_option": "A",
        "explanation": "Q-Learning is off-policy because its update target uses max_a' Q(s', a') (the optimal target policy), even when behavior actions are chosen via an exploratory policy (e.g. epsilon-greedy)."
    })
    questions.append({
        "id": "AI-A-22",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Transformers & Attention",
        "question_text": "What is the mathematical formulation of Scaled Dot-Product Attention introduced in the Transformer architecture?",
        "option_a": "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V",
        "option_b": "Attention(Q, K, V) = tanh(Q * W_q + K * W_k) * V",
        "option_c": "Attention(Q, K, V) = sigmoid(Q * K^T) + V",
        "option_d": "Attention(Q, K, V) = (Q * K * V) / d_k",
        "correct_option": "A",
        "explanation": "Scaled Dot-Product Attention computes query-key similarity matrices, scales by 1/sqrt(d_k) to prevent vanishing softmax gradients, and computes a weighted sum of values V."
    })
    questions.append({
        "id": "AI-A-23",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Bayesian Networks",
        "question_text": "In a Bayesian Belief Network, what defines the 'Markov Blanket' of a target node X?",
        "option_a": "X's parents, X's children, and all other parents of X's children (co-parents)",
        "option_b": "Only the immediate root ancestors of X",
        "option_c": "All nodes sharing the same topological depth as X",
        "option_d": "The terminal leaf nodes descending from X",
        "correct_option": "A",
        "explanation": "The Markov Blanket of node X consists of its parents, children, and spouses (co-parents). Conditioned on its Markov Blanket, X is conditionally independent of all other nodes in the network."
    })
    questions.append({
        "id": "AI-A-24",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Constraint Satisfaction",
        "question_text": "What does the AC-3 algorithm enforce across all binary constraints in a Constraint Satisfaction Problem?",
        "option_a": "Arc Consistency: for every value in variable X_i's domain, there exists at least one allowable value in neighbor X_j's domain",
        "option_b": "Global variable elimination via Gaussian elimination",
        "option_c": "Topological sorting of the search space",
        "option_d": "Equivalence of all variable domains to size 1",
        "correct_option": "A",
        "explanation": "AC-3 iteratively prunes values from variable domains that violate binary constraints until every directed arc (X_i, X_j) is arc consistent."
    })
    questions.append({
        "id": "AI-A-25",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "NLP & Language Models",
        "question_text": "What architectural distinction separates BERT from GPT?",
        "option_a": "BERT uses bidirectional Transformer encoders trained with masked language modeling, whereas GPT uses autoregressive causal decoders",
        "option_b": "BERT generates free-form text token by token while GPT only produces sentence embeddings",
        "option_c": "BERT is trained using reinforcement learning while GPT only uses supervised learning",
        "option_d": "BERT cannot process subword tokenizers",
        "correct_option": "A",
        "explanation": "BERT is a bidirectional encoder trained on Masked Language Modeling (MLM), whereas GPT is a unidirectional left-to-right autoregressive decoder designed for sequential text generation."
    })
    questions.append({
        "id": "AI-A-26",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Computer Vision",
        "question_text": "What does the concept of 'Receptive Field' denote in a deep convolutional neural network?",
        "option_a": "The specific region of the input image space that influences the activation of a particular neuron in a deeper layer",
        "option_b": "The number of color channels in the input image",
        "option_c": "The GPU memory footprint allocated for feature maps",
        "option_d": "The total number of parameters in the fully connected classification head",
        "correct_option": "A",
        "explanation": "The receptive field measures the spatial window of raw input pixels that can mathematically affect a given feature map unit, expanding as depth increases."
    })
    questions.append({
        "id": "AI-A-27",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Generative AI",
        "question_text": "In a Variational Autoencoder (VAE), why is the 'Reparameterization Trick' necessary for end-to-end backpropagation?",
        "option_a": "Direct random sampling from N(mu, sigma) is non-differentiable; expressing z = mu + sigma * epsilon (where epsilon ~ N(0, I)) allows gradients to backpropagate through mu and sigma",
        "option_b": "It converts latent vectors into discrete one-hot vectors",
        "option_c": "It forces the reconstruction loss to zero",
        "option_d": "It replaces the decoder with a linear regression layer",
        "correct_option": "A",
        "explanation": "Sampling from a distribution has no defined gradient with respect to distribution parameters. The reparameterization trick isolates stochasticity into an independent noise variable epsilon."
    })
    questions.append({
        "id": "AI-A-28",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Search Algorithms",
        "question_text": "What is the relationship between heuristic consistency (monotonicity) and admissibility in graph search?",
        "option_a": "Every consistent heuristic is admissible, and consistency guarantees optimal A* graph search without reopening closed nodes",
        "option_b": "Admissibility implies consistency in all cases",
        "option_c": "Consistent heuristics always overestimate path costs",
        "option_d": "Consistency requires h(n) to be zero for all non-goal nodes",
        "correct_option": "A",
        "explanation": "Consistency satisfies the triangle inequality h(n) <= c(n, a, n') + h(n'). Every consistent heuristic is admissible and ensures that the first time a node is expanded in graph search, an optimal path has been found."
    })
    questions.append({
        "id": "AI-A-29",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Planning",
        "question_text": "In classical STRIPS AI planning, what three lists define an operator (action schema)?",
        "option_a": "Preconditions, Add List (effects to add), and Delete List (effects to remove)",
        "option_b": "Inputs, Weights, and Biases",
        "option_c": "States, Actions, and Rewards",
        "option_d": "Hypotheses, Axioms, and Theorems",
        "correct_option": "A",
        "explanation": "STRIPS operators consist of Preconditions (conditions required to execute the action), an Add List (positive fluents asserted by action), and a Delete List (fluents negated)."
    })
    questions.append({
        "id": "AI-A-30",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Reinforcement Learning",
        "question_text": "How does SARSA differ from Q-Learning in its temporal difference target update?",
        "option_a": "SARSA is on-policy: it uses the action a' actually selected by the current behavioral policy (Q(s', a')) rather than the greedy maximum",
        "option_b": "SARSA does not use a learning rate alpha",
        "option_c": "SARSA only operates in continuous action spaces",
        "option_d": "SARSA trains an adversarial neural network",
        "correct_option": "A",
        "explanation": "SARSA stands for State-Action-Reward-State-Action. It evaluates the target using the action a' chosen by the current epsilon-greedy policy, making it an on-policy TD method."
    })
    questions.append({
        "id": "AI-A-31",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Foundation Models",
        "question_text": "In LLM generation sampling, what is the effect of lowering the 'Temperature' hyperparameter toward zero?",
        "option_a": "The output probability distribution becomes sharper and more deterministic, favoring greedy high-probability tokens",
        "option_b": "The model generates completely random uniform tokens",
        "option_c": "The maximum context window size is reduced",
        "option_d": "The model deletes all punctuation marks",
        "correct_option": "A",
        "explanation": "Temperature divides logits prior to softmax: lower temperature sharpens the distribution, driving probabilities toward the mode and making generation more deterministic."
    })
    questions.append({
        "id": "AI-A-32",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Object Detection",
        "question_text": "What does Intersection over Union (IoU) evaluate in bounding box object detection?",
        "option_a": "The area of overlap between predicted and ground-truth bounding boxes divided by their combined area of union",
        "option_b": "The total number of detected object categories",
        "option_c": "The execution latency of the backbone network",
        "option_d": "The ratio of false positives to true negatives",
        "correct_option": "A",
        "explanation": "IoU = Area(Overlap) / Area(Union). An IoU >= 0.5 (or 0.75) is standardly used to determine whether a detected bounding box is a True Positive."
    })
    questions.append({
        "id": "AI-A-33",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Prompt Engineering & RAG",
        "question_text": "What is the primary operational mechanism of Retrieval-Augmented Generation (RAG)?",
        "option_a": "Retrieving relevant factual text passages from external vector databases and injecting them into the LLM context prompt prior to generation",
        "option_b": "Fine-tuning all transformer weights using reinforcement learning from human feedback",
        "option_c": "Converting user prompts into executable bytecode",
        "option_d": "Compressing LLM weights using 4-bit quantization",
        "correct_option": "A",
        "explanation": "RAG queries an external retrieval system (e.g. vector search) for contextually relevant documents and supplies them to the prompt, grounding the LLM's response in authoritative facts."
    })
    questions.append({
        "id": "AI-A-34",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Intermediate",
        "topic": "Reinforcement Learning",
        "question_text": "What is the role of the discount factor gamma in the Bellman equation for return G_t = sum gamma^k R_{t+k+1}?",
        "option_a": "To balance the immediate value of current rewards against delayed future rewards, ensuring convergence of infinite-horizon returns",
        "option_b": "To rescale neural network weights to unit length",
        "option_c": "To set the exploration probability in epsilon-greedy selection",
        "option_d": "To eliminate negative rewards from the environment",
        "correct_option": "A",
        "explanation": "The discount factor gamma in [0, 1) prioritizes near-term rewards over distant rewards and mathematically ensures that infinite-horizon cumulative sums remain finite."
    })

    # --- Advanced (16 Questions) ---
    questions.append({
        "id": "AI-A-35",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Reinforcement Learning",
        "question_text": "What does the Policy Gradient Theorem establish regarding the gradient of the expected return J(theta) with respect to policy parameters theta?",
        "option_a": "grad J(theta) = E [ grad log pi_theta(a | s) * Q^pi(s, a) ], eliminating the need to compute derivatives of the unknown environment state distribution",
        "option_b": "grad J(theta) is identically zero at all stochastic policies",
        "option_c": "Policy gradients can only be computed when transition matrices are fully deterministic",
        "option_d": "The gradient equals the inverse Fisher Information Matrix directly",
        "correct_option": "A",
        "explanation": "The Policy Gradient Theorem proves that the gradient of cumulative reward depends on the score function grad log pi_theta(a|s) weighted by action values, bypassing unknown state transition dynamics."
    })
    questions.append({
        "id": "AI-A-36",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Transformers",
        "question_text": "Why do standard Transformer models require explicit Positional Encodings (e.g. sinusoidal or RoPE)?",
        "option_a": "Self-attention operations are permutation-equivariant and possess no inherent inductive bias regarding token sequence order",
        "option_b": "Positional encodings normalize the attention matrix across the sequence dimension",
        "option_c": "Transformers cannot compute matrix products without non-zero diagonal entries",
        "option_d": "Positional encodings prevent attention scores from exploding to infinity",
        "correct_option": "A",
        "explanation": "Because self-attention treats tokens as an unordered set (permutation equivariant), position embeddings must be added or rotary-applied to preserve word order semantics."
    })
    questions.append({
        "id": "AI-A-37",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Bayesian Networks",
        "question_text": "Under the rules of d-separation in directed graphical models, when does a collider (v-structure: X -> Z <- Y) block the path between X and Y?",
        "option_a": "The path is blocked when neither Z nor any of Z's descendants are in the conditioning set",
        "option_b": "The path is blocked if and only if Z is explicitly observed in the conditioning set",
        "option_c": "Colliders never block paths under any conditioning",
        "option_d": "The path is blocked when both parents X and Y share identical prior probabilities",
        "correct_option": "A",
        "explanation": "In a collider X -> Z <- Y, X and Y are marginally independent (path blocked). Conditioning on collider Z (or its descendants) 'opens' the path, inducing dependence (explaining away)."
    })
    questions.append({
        "id": "AI-A-38",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Generative AI",
        "question_text": "In Denoising Diffusion Probabilistic Models (DDPM), what is the objective of the reverse diffusion process?",
        "option_a": "To iteratively remove learned Gaussian noise from a latent sample using a parameterized neural network to reconstruct clean data",
        "option_b": "To apply forward Brownian motion until data collapses to an isotropic Gaussian",
        "option_c": "To maximize the Wasserstein distance between real and synthetic images",
        "option_d": "To project feature maps into Fourier frequency space",
        "correct_option": "A",
        "explanation": "DDPM defines a forward process that adds Gaussian noise systematically, and trains a reverse neural network (typically a U-Net) to predict and remove noise step-by-step."
    })
    questions.append({
        "id": "AI-A-39",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Adversarial Search",
        "question_text": "What is the 'Horizon Effect' encountered in fixed-depth heuristic game tree search?",
        "option_a": "The search engine pushes an unavoidable severe detriment just beyond the maximum search depth horizon by making delaying moves",
        "option_b": "The evaluation function causes memory overflow due to wide branching",
        "option_c": "The minimax score oscillates between positive and negative infinity",
        "option_d": "Alpha-beta cutoffs fail to prune symmetric leaves",
        "correct_option": "A",
        "explanation": "The horizon effect occurs when fixed-depth searches make stalling sacrifices to push catastrophic opponent moves past the search horizon, failing to resolve underlying tactical threats."
    })
    questions.append({
        "id": "AI-A-40",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Reinforcement Learning",
        "question_text": "In Deep Q-Networks (DQN), what is the function of the Target Network and Experience Replay buffer?",
        "option_a": "Experience Replay breaks temporal correlation between consecutive samples, while the Target Network stabilizes TD targets by updating parameters periodically",
        "option_b": "They eliminate the necessity of exploratory epsilon-greedy actions",
        "option_c": "They guarantee linear convergence on non-Markovian environments",
        "option_d": "They enforce policy determinism in continuous control tasks",
        "correct_option": "A",
        "explanation": "DQN uses replay buffers to decorrelate training transitions and a periodically updated target network to prevent target values from shifting constantly during gradient updates."
    })
    questions.append({
        "id": "AI-A-41",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "First-Order Logic",
        "question_text": "What is the purpose of Skolemization during the conversion of First-Order Logic sentences into Conjunctive Normal Form (CNF)?",
        "option_a": "To eliminate existential quantifiers (exists) by replacing existentially quantified variables with Skolem constants or Skolem functions of universally quantified outer variables",
        "option_b": "To convert all predicates into binary propositional atoms",
        "option_c": "To prove that the knowledge base is decidable",
        "option_d": "To remove all negation operators via De Morgan's laws",
        "correct_option": "A",
        "explanation": "Skolemization replaces existentially quantified variables with functions of enclosing universally quantified variables, producing an equisatisfiable formula without existential quantifiers."
    })
    questions.append({
        "id": "AI-A-42",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Reinforcement Learning",
        "question_text": "What mathematical guarantee is provided by the Bellman Expectation Equation under the contraction mapping theorem?",
        "option_a": "The Bellman backup operator is a gamma-contraction in the supremum norm, guaranteeing convergence to a unique fixed-point optimal value function V*",
        "option_b": "The policy is guaranteed to reach the goal state in O(N) steps",
        "option_c": "All actions achieve identical expected Q-values",
        "option_d": "Policy iteration requires strictly fewer iterations than value iteration",
        "correct_option": "A",
        "explanation": "Because gamma < 1, the Bellman operator satisfies ||T(U) - T(V)||_inf <= gamma * ||U - V||_inf. By the Banach Fixed-Point Theorem, value iteration converges to a unique V*."
    })
    questions.append({
        "id": "AI-A-43",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "NLP & Alignment",
        "question_text": "In Direct Preference Optimization (DPO) for aligning LLMs, how does DPO reformulate the RLHF objective?",
        "option_a": "It analytically optimizes the Bradley-Terry preference model directly over the policy logits, bypassing the need to train and sample from a separate explicit reward model",
        "option_b": "It replaces cross-entropy loss with mean squared error on human ratings",
        "option_c": "It forces all tokens to match the distribution of a teacher model exactly",
        "option_d": "It requires manual human annotation in the loop during every gradient step",
        "correct_option": "A",
        "explanation": "DPO leverages an analytical relationship between reward functions and optimal policies, training the LLM directly on preferred vs dispreferred pairs via binary cross-entropy without an explicit reward model."
    })
    questions.append({
        "id": "AI-A-44",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Foundation Models",
        "question_text": "What computational benefit is provided by FlashAttention in Transformer inference and training?",
        "option_a": "It reorders softmax and matrix tiling to compute exact attention within fast on-chip SRAM, minimizing slow high-bandwidth memory (HBM) memory access",
        "option_b": "It approximates the attention matrix using low-rank random Fourier features",
        "option_c": "It removes all backward pass computations",
        "option_d": "It quantizes weights to 1-bit integers",
        "correct_option": "A",
        "explanation": "FlashAttention is an IO-aware exact attention algorithm: using tiling and online softmax, it computes attention without materializing the large N x N intermediate matrix in slow GPU HBM."
    })
    questions.append({
        "id": "AI-A-45",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Constraint Satisfaction",
        "question_text": "In CSP backtracking search, what is the 'Minimum Remaining Values' (MRV) variable selection heuristic?",
        "option_a": "Choosing the variable with the fewest allowable values remaining in its domain to fail-first and prune subtrees early",
        "option_b": "Choosing the variable that is involved in the largest number of constraints with unassigned variables",
        "option_c": "Assigning values in alphabetical order",
        "option_d": "Selecting variables completely at random to avoid local traps",
        "correct_option": "A",
        "explanation": "MRV (also called 'most constrained variable' or 'fail-first') picks the variable with the smallest domain, detecting dead ends as early as possible to minimize search tree depth."
    })
    questions.append({
        "id": "AI-A-46",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Reinforcement Learning",
        "question_text": "What problem does Proximal Policy Optimization (PPO) solve through its clipped surrogate objective L^CLIP(theta)?",
        "option_a": "It prevents destructively large policy parameter updates by penalizing probability ratios r_t(theta) that deviate significantly from 1",
        "option_b": "It forces value networks to match empirical rewards identically",
        "option_c": "It eliminates the need for baseline advantage estimation",
        "option_d": "It converts continuous action spaces into discrete binary trees",
        "correct_option": "A",
        "explanation": "PPO clips the importance ratio r_t(theta) to [1 - epsilon, 1 + epsilon], preventing the new policy from moving too far from the old policy and ensuring stable monotonic policy improvements."
    })
    questions.append({
        "id": "AI-A-47",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Planning & POMDPs",
        "question_text": "In a Partially Observable Markov Decision Process (POMDP), what represents the agent's internal state?",
        "option_a": "A Belief State: a continuous probability distribution over all possible true underlying states in the environment",
        "option_b": "The single most recent sensor observation value",
        "option_c": "A deterministic lookup table of future actions",
        "option_d": "The gradient of the observation transition matrix",
        "correct_option": "A",
        "explanation": "Because POMDP agents cannot observe the true state directly, they maintain a Belief State b(s) — a posterior probability distribution over all possible states given past actions and observations."
    })
    questions.append({
        "id": "AI-A-48",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Knowledge Graphs & Embeddings",
        "question_text": "In Knowledge Graph embedding models like TransE, what geometric relationship is modeled for a fact triple (head, relation, tail)?",
        "option_a": "Translation in vector space: h + r ≈ t",
        "option_b": "Dot product equality: h dot r = t",
        "option_c": "Cross product: h x r = t",
        "option_d": "Tensor contraction: h * r * t = 0",
        "correct_option": "A",
        "explanation": "TransE embeds entities and relations into a vector space such that if relation r holds between head h and tail t, the vector relation satisfies h + r ≈ t."
    })
    questions.append({
        "id": "AI-A-49",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "Generative AI",
        "question_text": "What is the Wasserstein GAN (WGAN) objective designed to fix over the original minimax GAN formulation?",
        "option_a": "It uses the Earth Mover's (Wasserstein-1) distance with a 1-Lipschitz critic to prevent vanishing gradients when support distributions do not overlap",
        "option_b": "It forces the generator to produce discrete categorical tokens",
        "option_c": "It eliminates the discriminator entirely",
        "option_d": "It guarantees that the generator converges in a single training step",
        "correct_option": "A",
        "explanation": "Standard GANs minimize Jensen-Shannon divergence, which saturates with vanishing gradients when distributions have disjoint supports. WGAN uses Wasserstein distance with a 1-Lipschitz critic, ensuring continuous gradients."
    })
    questions.append({
        "id": "AI-A-50",
        "subject": "Artificial Intelligence",
        "set_name": "A",
        "difficulty": "Advanced",
        "topic": "AI Safety & Alignment",
        "question_text": "In reinforcement learning alignment, what is 'Reward Hacking' (Specification Gaming)?",
        "option_a": "The agent exploits flaws, loopholes, or unintended shortcuts in the reward specification to achieve high numerical rewards without fulfilling the designer's intended goal",
        "option_b": "A malicious actor modifying network weights via hardware injection",
        "option_c": "The reward function returning NaN due to numerical underflow",
        "option_d": "The agent intentionally choosing actions with zero reward",
        "correct_option": "A",
        "explanation": "Reward hacking occurs when an agent exploits unintended artifacts or omissions in the formal reward function to maximize return in a way that violates the designer's true intent."
    })

    # ==========================================
    # SET B (50 Questions) - Equivalent difficulty & topic coverage
    # ==========================================

    # --- Beginner (16 Questions) ---
    questions.append({
        "id": "AI-B-01",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Search Algorithms",
        "question_text": "Which search algorithm uses a LIFO stack (or recursion) to explore as deeply as possible along each branch before backtracking?",
        "option_a": "Depth-First Search (DFS)",
        "option_b": "Breadth-First Search (BFS)",
        "option_c": "Uniform-Cost Search",
        "option_d": "A* Search",
        "correct_option": "A",
        "explanation": "Depth-First Search (DFS) dives deeply into a search tree using a LIFO stack, backtracking only when reaching leaf nodes or hitting depth boundaries."
    })
    questions.append({
        "id": "AI-B-02",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Turing Test & Agent Basics",
        "question_text": "In Artificial Intelligence, what defines a 'Rational Agent'?",
        "option_a": "An entity that perceives its environment through sensors and selects actions that maximize its expected performance measure",
        "option_b": "A system that mimics human biological neural firing patterns exactly",
        "option_c": "A computer program that never encounters a software error",
        "option_d": "A machine that always possesses complete and perfect information about the future",
        "correct_option": "A",
        "explanation": "A rational agent selects actions that maximize expected utility based on its perceptual history and built-in knowledge, regardless of whether it mimics human cognition."
    })
    questions.append({
        "id": "AI-B-03",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Heuristic Search",
        "question_text": "In the A* evaluation formula f(n) = g(n) + h(n), what does h(n) represent?",
        "option_a": "The estimated heuristic cost to reach the goal state from current node n",
        "option_b": "The exact cost incurred from the start node to node n",
        "option_c": "The maximum number of nodes in the open list",
        "option_d": "The total elapsed wall-clock computation time",
        "correct_option": "A",
        "explanation": "In A* search, h(n) is the heuristic function estimating the remaining path cost from node n to the nearest goal state."
    })
    questions.append({
        "id": "AI-B-04",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Adversarial Search",
        "question_text": "In the Minimax algorithm, what assumption is made about the opponent (MIN player)?",
        "option_a": "The opponent will always select the move that minimizes MAX's payoff (optimal adversarial play)",
        "option_b": "The opponent will make random suboptimal moves",
        "option_c": "The opponent shares the exact same objective function as MAX",
        "option_d": "The opponent cannot evaluate utility values at terminal nodes",
        "correct_option": "A",
        "explanation": "Minimax operates under the worst-case assumption that the adversary (MIN) plays optimally to minimize the utility of the MAX player."
    })
    questions.append({
        "id": "AI-B-05",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Knowledge Representation",
        "question_text": "What is the classical rule of inference Modus Ponens?",
        "option_a": "From premises 'P' and 'P -> Q', infer 'Q'",
        "option_b": "From premises 'Q' and 'P -> Q', infer 'P'",
        "option_c": "From premises 'not P' and 'P -> Q', infer 'not Q'",
        "option_d": "From premises 'P and Q', infer 'not P'",
        "correct_option": "A",
        "explanation": "Modus Ponens (affirming the antecedent) states that if proposition P is true, and the conditional statement P -> Q is true, then Q must be true."
    })
    questions.append({
        "id": "AI-B-06",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Expert Systems",
        "question_text": "What is Forward Chaining in inference engines?",
        "option_a": "Data-driven reasoning starting with known facts and repeatedly firing rules to infer new conclusions",
        "option_b": "Goal-driven reasoning starting with a hypothesis and working backward to find supporting facts",
        "option_c": "Evaluating random permutations of propositions",
        "option_d": "Pruning game trees using alpha and beta cutoffs",
        "correct_option": "A",
        "explanation": "Forward chaining is data-driven: it begins with observed facts in working memory and matches them against IF conditions to deduce new facts until a goal is reached."
    })
    questions.append({
        "id": "AI-B-07",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Reinforcement Learning Basics",
        "question_text": "In Reinforcement Learning, what constitutes an 'Episode'?",
        "option_a": "A complete sequence of states, actions, and rewards from an initial state to a terminal state",
        "option_b": "A single step update of a value function",
        "option_c": "One pass through a neural network's convolutional layer",
        "option_d": "A human operator interrupting an autonomous vehicle",
        "correct_option": "A",
        "explanation": "An episode represents a full trial run in episodic tasks, starting at an initial state and terminating when a goal or terminal condition is met."
    })
    questions.append({
        "id": "AI-B-08",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "NLP Basics",
        "question_text": "What is the difference between Stemming and Lemmatization in text processing?",
        "option_a": "Stemming uses crude heuristic chopping of word endings, while lemmatization uses vocabulary and morphological analysis to return valid root words",
        "option_b": "Stemming requires deep neural transformers while lemmatization uses regular expressions",
        "option_c": "Stemming converts text into numbers while lemmatization converts numbers into text",
        "option_d": "Lemmatization can only be performed on Chinese text",
        "correct_option": "A",
        "explanation": "Stemming applies rule-based heuristic stripping of suffixes (often creating non-words like 'studi'), while lemmatization leverages dictionary lemmas (e.g. 'better' -> 'good')."
    })
    questions.append({
        "id": "AI-B-09",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Computer Vision Basics",
        "question_text": "What is the purpose of the 'Stride' parameter in a convolutional operation?",
        "option_a": "The step size (in pixels) by which the convolutional kernel filter slides across the input matrix",
        "option_b": "The total number of training epochs between evaluations",
        "option_c": "The amount of zero-padding added around image borders",
        "option_d": "The learning rate multiplier for convolutional biases",
        "correct_option": "A",
        "explanation": "Stride defines the spatial distance the convolutional kernel moves at each step: a stride of 2 shifts the window by 2 pixels, halving spatial dimensions."
    })
    questions.append({
        "id": "AI-B-10",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Generative AI Basics",
        "question_text": "In a standard Autoencoder, what is the 'Latent Space' (bottleneck)?",
        "option_a": "A compressed low-dimensional representation capturing the essential features of the input data",
        "option_b": "The memory cache used for storing training gradients",
        "option_c": "The output classification probability vector",
        "option_d": "The initial uninitialized weight parameters",
        "correct_option": "A",
        "explanation": "The bottleneck latent space constrains data flow to lower dimensions, forcing the encoder network to learn efficient, compressed representations of the input distribution."
    })
    questions.append({
        "id": "AI-B-11",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Constraint Satisfaction",
        "question_text": "In a Constraint Satisfaction Problem, what are the three fundamental components defined in the formal tuple?",
        "option_a": "Variables, Domains (allowable values), and Constraints (restrictions on allowable combinations)",
        "option_b": "Weights, Biases, and Loss Functions",
        "option_c": "States, Actions, and Rewards",
        "option_d": "Entities, Attributes, and Relationships",
        "correct_option": "A",
        "explanation": "A CSP is formally defined as (X, D, C): a set of Variables X, a domain of values D for each variable, and a set of Constraints C governing legal value assignments."
    })
    questions.append({
        "id": "AI-B-12",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Search Algorithms",
        "question_text": "What is the space complexity advantage of Depth-First Search over Breadth-First Search?",
        "option_a": "DFS requires memory linear in maximum search depth O(b * m), whereas BFS consumes memory exponential in shallowest goal depth O(b^d)",
        "option_b": "DFS consumes strictly O(1) memory in all circumstances",
        "option_c": "DFS eliminates the frontier list entirely",
        "option_d": "DFS does not store visited paths in memory",
        "correct_option": "A",
        "explanation": "DFS only needs to store the current branch path and unexpanded siblings (O(b * m)), making its memory consumption orders of magnitude lower than BFS (O(b^d))."
    })
    questions.append({
        "id": "AI-B-13",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "AI Concepts",
        "question_text": "What is an 'Environment' in the context of intelligent agent architecture?",
        "option_a": "The external world or problem domain in which the agent operates, receives percepts from, and alters via actions",
        "option_b": "The Python programming runtime version running the script",
        "option_c": "The hardware GPU enclosure housing the processors",
        "option_d": "The set of all pre-trained model weights",
        "correct_option": "A",
        "explanation": "The environment encapsulates all external context with which an agent interacts: the agent perceives state via sensors and executes effects via actuators."
    })
    questions.append({
        "id": "AI-B-14",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "NLP Basics",
        "question_text": "What does a Bag-of-Words (BoW) text representation disregard completely?",
        "option_a": "Grammar, syntax, and word sequence order in the document",
        "option_b": "The total count of word occurrences",
        "option_c": "The presence of uppercase letters",
        "option_d": "The vocabulary size of the corpus",
        "correct_option": "A",
        "explanation": "Bag-of-Words tallies word frequencies while completely discarding token position, syntactic dependencies, and sequential word order."
    })
    questions.append({
        "id": "AI-B-15",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Ethics & Safety",
        "question_text": "Why is training data bias a major concern in AI deployment?",
        "option_a": "Models learn and amplify historical, societal, or sampling disparities present in training data, producing discriminatory predictions",
        "option_b": "Biased data causes GPUs to overheat during forward passes",
        "option_c": "Biased data converts all models into decision trees",
        "option_d": "Bias causes loss functions to produce negative values",
        "correct_option": "A",
        "explanation": "Machine learning systems replicate statistical patterns in training sets; if training sets reflect demographic inequities, model outputs reproduce those biased disparities."
    })
    questions.append({
        "id": "AI-B-16",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Beginner",
        "topic": "Computer Vision Basics",
        "question_text": "What is 'Padding' (e.g. Zero-Padding) used for in convolutional layers?",
        "option_a": "Adding border pixels around the input image to preserve spatial feature map dimensions and prevent border information loss",
        "option_b": "Compressing color depth from 24 bits to 8 bits",
        "option_c": "Normalizing pixel brightness across video frames",
        "option_d": "Deleting dead neurons from convolutional filters",
        "correct_option": "A",
        "explanation": "Padding borders (often with zeros) prevents spatial shrinkage after convolution, allowing deep architectures to preserve border feature information across many layers."
    })

    # --- Intermediate (18 Questions) ---
    questions.append({
        "id": "AI-B-17",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Search Algorithms",
        "question_text": "What does Iterative Deepening A* (IDA*) optimize compared to standard A* search?",
        "option_a": "It uses an f-cost threshold cutoff to reduce memory consumption to O(b * d) while retaining optimality and completeness",
        "option_b": "It eliminates the need for an admissible heuristic",
        "option_c": "It guarantees execution in constant O(1) time",
        "option_d": "It replaces priority queues with hash tables",
        "correct_option": "A",
        "explanation": "IDA* runs depth-first searches bounded by f(n) = g(n) + h(n) cost cutoffs, increasing the threshold each iteration, providing A*'s optimality with DFS's minimal linear memory footprint."
    })
    questions.append({
        "id": "AI-B-18",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Adversarial Search",
        "question_text": "In Alpha-Beta pruning, what condition immediately triggers a beta cutoff at a MIN node?",
        "option_a": "When the value of the MIN node becomes less than or equal to alpha (v <= alpha)",
        "option_b": "When the value of the MIN node exceeds beta (v > beta)",
        "option_c": "When all leaf nodes have identical utility",
        "option_d": "When the search depth reaches zero",
        "correct_option": "A",
        "explanation": "At a MIN node, if the utility drops below alpha (the best score MAX is already guaranteed elsewhere), MAX will never permit play to reach this state, allowing immediate pruning."
    })
    questions.append({
        "id": "AI-B-19",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Logic and Inference",
        "question_text": "What is Backward Chaining in an expert system or logical theorem prover?",
        "option_a": "A goal-driven strategy that starts with a query hypothesis and works backward checking if supporting rules and base facts exist",
        "option_b": "A forward simulation of continuous Markov chains",
        "option_c": "Computing the reverse gradient of a recurrent layer",
        "option_d": "Sorting logical clauses alphabetically by predicate name",
        "correct_option": "A",
        "explanation": "Backward chaining is goal-directed: to prove goal G, it identifies rules having G in their THEN clause and recursively attempts to satisfy their IF antecedents."
    })
    questions.append({
        "id": "AI-B-20",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Markov Decision Processes",
        "question_text": "What does the Bellman Optimality Equation for state-value function V*(s) state?",
        "option_a": "V*(s) = max_a sum_s' P(s' | s, a) * [ R(s, a, s') + gamma * V*(s') ]",
        "option_b": "V*(s) = sum_a pi(a | s) * R(s, a)",
        "option_c": "V*(s) = min_a [ R(s, a) - gamma * V*(s) ]",
        "option_d": "V*(s) = 1 / (1 + exp(-s))",
        "correct_option": "A",
        "explanation": "The Bellman Optimality Equation expresses that the value of an optimal state equals the maximum expected immediate reward plus the discounted value of successor states over all actions a."
    })
    questions.append({
        "id": "AI-B-21",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Reinforcement Learning",
        "question_text": "What is the update rule for the action-value function Q(s, a) in Q-Learning with learning rate alpha and discount factor gamma?",
        "option_a": "Q(s, a) <- Q(s, a) + alpha * [ R + gamma * max_a' Q(s', a') - Q(s, a) ]",
        "option_b": "Q(s, a) <- Q(s, a) + alpha * [ R + gamma * Q(s', a') ]",
        "option_c": "Q(s, a) <- R + gamma * Q(s, a)",
        "option_d": "Q(s, a) <- alpha * max_a' Q(s', a')",
        "correct_option": "A",
        "explanation": "Q-learning updates Q(s, a) using the temporal difference error [ R + gamma * max_a' Q(s', a') - Q(s, a) ] weighted by learning rate alpha."
    })
    questions.append({
        "id": "AI-B-22",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Transformers & Attention",
        "question_text": "What is the purpose of Multi-Head Attention over single-head attention in Transformers?",
        "option_a": "It projects queries, keys, and values into multiple representation subspaces, enabling the model to jointly attend to information from different representation aspects simultaneously",
        "option_b": "It reduces the parameter count of the Transformer model to zero",
        "option_c": "It eliminates the need for feed-forward layers",
        "option_d": "It forces all attention weights to be strictly binary (0 or 1)",
        "correct_option": "A",
        "explanation": "Multi-head attention runs attention in parallel across h subspaces, allowing the model to simultaneously focus on syntactic, semantic, and positional relationships."
    })
    questions.append({
        "id": "AI-B-23",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Bayesian Networks",
        "question_text": "How is the joint probability distribution factored in a Bayesian Network with variables X_1 to X_n?",
        "option_a": "P(X_1, ..., X_n) = prod_i P(X_i | Parents(X_i))",
        "option_b": "P(X_1, ..., X_n) = sum_i P(X_i)",
        "option_c": "P(X_1, ..., X_n) = prod_i P(X_i)",
        "option_d": "P(X_1, ..., X_n) = max_i P(X_i | X_{i-1})",
        "correct_option": "A",
        "explanation": "The chain rule for Bayesian Networks simplifies the full joint distribution into a product of conditional probabilities of each variable given only its direct parents in the DAG."
    })
    questions.append({
        "id": "AI-B-24",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Constraint Satisfaction",
        "question_text": "What is Forward Checking in CSP backtracking search?",
        "option_a": "Whenever variable X is assigned, it checks unassigned neighbors Y and immediately removes values from domain D(Y) that conflict with X's assignment",
        "option_b": "It computes all possible solutions before executing search",
        "option_c": "It randomizes variable ordering to prevent dead ends",
        "option_d": "It converts binary constraints into unary constraints",
        "correct_option": "A",
        "explanation": "Forward checking maintains partial arc consistency: upon assigning a variable, it filters out conflicting domain values from directly connected unassigned variables."
    })
    questions.append({
        "id": "AI-B-25",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "NLP & Language Models",
        "question_text": "What is Byte-Pair Encoding (BPE) in modern language models?",
        "option_a": "A subword tokenization algorithm that iteratively merges the most frequent pairs of adjacent bytes or characters to build a compact vocabulary",
        "option_b": "A lossy compression scheme for reducing embedding dimension size",
        "option_c": "An encryption standard for securing model weights",
        "option_d": "A recurrent neural network cell designed for long sequences",
        "correct_option": "A",
        "explanation": "BPE starts at character/byte level and greedily merges frequent co-occurring pairs into subwords, balancing out-of-vocabulary flexibility with compact token sequences."
    })
    questions.append({
        "id": "AI-B-26",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Computer Vision",
        "question_text": "What is the structural difference between 1x1 convolutions (pointwise convolutions) and standard 3x3 convolutions?",
        "option_a": "1x1 convolutions pool across channel dimensions to change channel depth without altering spatial height and width",
        "option_b": "1x1 convolutions cannot have learnable weight parameters",
        "option_c": "1x1 convolutions can only accept binary inputs",
        "option_d": "1x1 convolutions downsample spatial dimensions by factor 2",
        "correct_option": "A",
        "explanation": "Pointwise 1x1 convolutions perform a linear combination across input channels at each pixel, used to reduce or expand channel depth efficiently (as in Inception and MobileNets)."
    })
    questions.append({
        "id": "AI-B-27",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Generative AI",
        "question_text": "What causes 'Mode Collapse' in Generative Adversarial Networks?",
        "option_a": "The generator learns to produce only a narrow subset of plausible outputs that fool the discriminator, failing to represent the true diversity of the data",
        "option_b": "The discriminator accuracy drops to zero immediately",
        "option_c": "The model weights overflow to positive infinity",
        "option_d": "The latent noise vector dimension is larger than image size",
        "correct_option": "A",
        "explanation": "Mode collapse occurs when the generator concentrates its probability mass on a few repetitive high-scoring patterns, ignoring other modes in the real data distribution."
    })
    questions.append({
        "id": "AI-B-28",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Search Algorithms",
        "question_text": "What is the heuristic property called when h(n) <= c(n, a, n') + h(n') for every node n and successor n'?",
        "option_a": "Consistency (or Monotonicity)",
        "option_b": "Admissibility",
        "option_c": "Completeness",
        "option_d": "Orthogonality",
        "correct_option": "A",
        "explanation": "Consistency is a form of the triangle inequality: the estimated cost from n to goal cannot exceed step cost to n' plus the estimated cost from n' to goal."
    })
    questions.append({
        "id": "AI-B-29",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Planning",
        "question_text": "In AI planning, what distinguishes Partial-Order Planning from Total-Order Planning?",
        "option_a": "Partial-Order Planning orders actions only when necessary to resolve conflicts, leaving independent action sequences unordered",
        "option_b": "Partial-Order Planning evaluates only half of the goal states",
        "option_c": "Total-Order Planning never uses heuristics",
        "option_d": "Partial-Order Planning requires deterministic transitions",
        "correct_option": "A",
        "explanation": "Partial-order planning searches the space of plans rather than states, placing ordering constraints between actions only when required to prevent clobbering causal links."
    })
    questions.append({
        "id": "AI-B-30",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Reinforcement Learning",
        "question_text": "In the Exploration vs Exploitation dilemma, what does the epsilon-greedy strategy do?",
        "option_a": "With probability 1 - epsilon it selects the best known greedy action (exploitation), and with probability epsilon it selects a random action (exploration)",
        "option_b": "It explores actions whose reward is strictly negative",
        "option_c": "It resets model parameters with probability epsilon",
        "option_d": "It scales learning rates exponentially",
        "correct_option": "A",
        "explanation": "Epsilon-greedy balances discovering new action values (exploring random actions with probability epsilon) with leveraging current best action estimates (exploiting with probability 1 - epsilon)."
    })
    questions.append({
        "id": "AI-B-31",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Foundation Models",
        "question_text": "In token sampling for large language models, what does Top-p (Nucleus) sampling do?",
        "option_a": "It restricts token selection to the smallest set of top-ranking tokens whose cumulative probability exceeds threshold p",
        "option_b": "It always selects the single top token having highest probability",
        "option_c": "It samples from the lowest p-percentile tokens",
        "option_d": "It discards tokens containing non-ASCII characters",
        "correct_option": "A",
        "explanation": "Nucleus (Top-p) sampling dynamically pools candidates by selecting the smallest subset of highest-probability tokens whose cumulative sum reaches threshold p."
    })
    questions.append({
        "id": "AI-B-32",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Object Detection",
        "question_text": "What is the purpose of Non-Maximum Suppression (NMS) in object detection pipelines?",
        "option_a": "To eliminate redundant, overlapping bounding boxes predicting the same object instance, keeping only the highest-confidence detection",
        "option_b": "To rescale bounding box coordinates to image dimensions",
        "option_c": "To convert color feature maps into binary silhouettes",
        "option_d": "To penalize false negatives during training backpropagation",
        "correct_option": "A",
        "explanation": "NMS sorts candidate bounding boxes by confidence, selects the top box, and eliminates all other boxes having an IoU overlap above a suppression threshold."
    })
    questions.append({
        "id": "AI-B-33",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Prompt Engineering & In-Context Learning",
        "question_text": "What is 'Few-Shot Prompting' (In-Context Learning) in LLM applications?",
        "option_a": "Providing a few input-output demonstration examples directly within the context prompt to guide the model's generation without updating model weights",
        "option_b": "Fine-tuning model weights on a small dataset of 10 samples",
        "option_c": "Restricting output answers to fewer than 5 words",
        "option_d": "Quantizing transformer layers to 2 bits",
        "correct_option": "A",
        "explanation": "Few-shot prompting conditions the model by prepending input-output exemplars into the prompt, steering downstream output format and reasoning without weight modification."
    })
    questions.append({
        "id": "AI-B-34",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Intermediate",
        "topic": "Reinforcement Learning",
        "question_text": "What is the primary difference between Value Iteration and Policy Iteration in MDP dynamic programming?",
        "option_a": "Policy Iteration alternates between full policy evaluation and policy improvement until policy stability; Value Iteration updates values in a single step using the Bellman optimality operator",
        "option_b": "Value iteration requires an environment simulator, while policy iteration does not",
        "option_c": "Policy iteration can only be used with discrete state spaces",
        "option_d": "Value iteration never converges to the optimal policy",
        "correct_option": "A",
        "explanation": "Policy Iteration iterates between full evaluation (solving linear equations) and greedy improvement. Value Iteration combines evaluation and improvement into single-step Bellman optimality updates."
    })

    # --- Advanced (16 Questions) ---
    questions.append({
        "id": "AI-B-35",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Reinforcement Learning",
        "question_text": "In Policy Gradient methods, what is the role of the Baseline function b(s) in grad J(theta) = E [ grad log pi(a|s) * (Q(s, a) - b(s)) ]?",
        "option_a": "To reduce the variance of the gradient estimator without introducing any bias into the expected gradient",
        "option_b": "To force the learning rate to decay to zero",
        "option_c": "To convert stochastic policies into deterministic actions",
        "option_d": "To guarantee that advantage values remain strictly positive",
        "correct_option": "A",
        "explanation": "Subtracting a state-dependent baseline b(s) (typically V(s)) preserves expected gradient values (zero bias) because sum grad pi(a|s) * b(s) = 0, while drastically lowering sample variance."
    })
    questions.append({
        "id": "AI-B-36",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Transformers",
        "question_text": "What is Rotary Position Embedding (RoPE) and how does it encode token positional information?",
        "option_a": "It applies a rotation matrix to Query and Key vectors in the 2D complex plane such that their inner product depends directly on relative token distance (m - n)",
        "option_b": "It adds a constant vector offset to all value vectors",
        "option_c": "It rotates image feature maps 90 degrees during data augmentation",
        "option_d": "It sets non-adjacent attention weights to zero",
        "correct_option": "A",
        "explanation": "RoPE encodes relative position by rotating queries and keys by an angle proportional to sequence position: <R_m q, R_n k> = g(q, k, m - n), enabling natural relative position attention."
    })
    questions.append({
        "id": "AI-B-37",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Bayesian Networks",
        "question_text": "In Probabilistic Graphical Models, what is the 'Explaining Away' phenomenon observed in collider structures?",
        "option_a": "Conditioning on a common effect (collider) induces negative dependence between mutually independent causes: confirmation of one cause reduces the posterior probability of the other",
        "option_b": "Adding nodes to a Bayesian network simplifies joint calculations",
        "option_c": "Marginal probabilities become independent of prior distributions",
        "option_d": "All posterior values become zero",
        "correct_option": "A",
        "explanation": "Explaining away occurs in colliders (e.g., Earthquake -> Alarm <- Burglary). If Alarm sounds and an Earthquake is confirmed, the probability of Burglary drops, explaining away the alarm."
    })
    questions.append({
        "id": "AI-B-38",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Generative AI",
        "question_text": "In Score-Based Generative Modeling, what does the score function grad_x log p(x) mathematically represent?",
        "option_a": "The vector field of gradients pointing in the direction of highest increase in data log-density in the input space",
        "option_b": "The classification accuracy of the discriminator network",
        "option_c": "The determinant of the latent covariance matrix",
        "option_d": "The total number of parameters in the diffusion U-Net",
        "correct_option": "A",
        "explanation": "The score function of a continuous probability density p(x) is its gradient with respect to data x: grad_x log p(x). Score-based models use Langevin dynamics to step along this vector field to synthesize samples."
    })
    questions.append({
        "id": "AI-B-39",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Adversarial Search",
        "question_text": "What is 'Quiescence Search' implemented in game engines to mitigate the horizon effect?",
        "option_a": "Extending search depth specifically for non-quiet (tactical) states like captures or checks until a stable position is reached before evaluating",
        "option_b": "Halting search immediately when time reaches 50%",
        "option_c": "Evaluating leaf nodes using random rollouts",
        "option_d": "Restricting move evaluations to pawn moves only",
        "correct_option": "A",
        "explanation": "Quiescence search expands dynamic, volatile positions (such as pending piece exchanges) beyond the nominal depth cutoff, preventing heuristic evaluations of transient tactical states."
    })
    questions.append({
        "id": "AI-B-40",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Reinforcement Learning",
        "question_text": "What is the primary contribution of Double DQN (DDQN) over vanilla Deep Q-Networks?",
        "option_a": "It decouples action selection from action evaluation to eliminate positive maximization bias in Q-target calculations",
        "option_b": "It doubles the number of replay memory buffers",
        "option_c": "It uses two discount factors simultaneously",
        "option_d": "It requires dual GPU processors to train",
        "correct_option": "A",
        "explanation": "Vanilla DQN uses max_a Q(s', a) with the same network to select and evaluate actions, causing overestimation bias. DDQN selects actions with the online network and evaluates with the target network."
    })
    questions.append({
        "id": "AI-B-41",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "First-Order Logic",
        "question_text": "What algorithm finds the most general substitution theta such that UNIFY(p, q) = theta for two logical expressions in First-Order Logic?",
        "option_a": "Robinson's Unification Algorithm",
        "option_b": "Dijkstra's Algorithm",
        "option_c": "The Viterbi Algorithm",
        "option_d": "Baum-Welch Algorithm",
        "correct_option": "A",
        "explanation": "Robinson's unification algorithm computes the Most General Unifier (MGU), identifying minimal variable substitutions that make two first-order logic predicates identical."
    })
    questions.append({
        "id": "AI-B-42",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Reinforcement Learning",
        "question_text": "What is Generalized Advantage Estimation (GAE) designed to balance in policy optimization?",
        "option_a": "The bias-variance tradeoff in advantage function estimation using an exponentially weighted average of k-step TD residuals controlled by parameter lambda",
        "option_b": "The ratio between actor network weights and critic network weights",
        "option_c": "The frequency of environment resets",
        "option_d": "The balance between CPU data loading and GPU inference",
        "correct_option": "A",
        "explanation": "GAE introduces parameter lambda in [0, 1] to blend k-step advantage estimates, interpolating between low-variance high-bias 1-step TD (lambda=0) and high-variance zero-bias Monte Carlo (lambda=1)."
    })
    questions.append({
        "id": "AI-B-43",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "NLP & Alignment",
        "question_text": "In RLHF with PPO, what is the role of the KL penalty term added to the reward: r(x, y) - beta * D_KL(pi_theta || pi_ref)?",
        "option_a": "To prevent the trained policy pi_theta from drifting excessively far from the initial reference policy pi_ref, avoiding reward collapse and degenerate text outputs",
        "option_b": "To ensure generated tokens follow a uniform distribution",
        "option_c": "To maximize training loss during validation passes",
        "option_d": "To force the policy to generate identical outputs on every run",
        "correct_option": "A",
        "explanation": "The KL penalty discourages the policy from exploiting inaccuracies in the learned reward model (reward hacking) by keeping it close to the frozen reference model."
    })
    questions.append({
        "id": "AI-B-44",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Foundation Models",
        "question_text": "In parameter-efficient fine-tuning (PEFT), how does Low-Rank Adaptation (LoRA) decompose weight updates delta W for a frozen pre-trained weight matrix W_0 in R^(d x k)?",
        "option_a": "delta W = B * A, where B in R^(d x r) and A in R^(r x k) with low rank r << min(d, k)",
        "option_b": "delta W = W_0^T * W_0",
        "option_c": "delta W = diag(W_0) * lambda",
        "option_d": "delta W = SVD(W_0) * 0",
        "correct_option": "A",
        "explanation": "LoRA freezes W_0 and injects trainable low-rank decomposition matrices delta W = B * A with rank r (often 4 to 64), dramatically reducing trainable parameters and memory during fine-tuning."
    })
    questions.append({
        "id": "AI-B-45",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Constraint Satisfaction",
        "question_text": "In CSP solving, what is the 'Least Constraining Value' (LCV) heuristic used for?",
        "option_a": "Ordering domain values so that the chosen value leaves the maximum flexibility (largest number of allowable choices) for neighboring unassigned variables",
        "option_b": "Selecting the variable with the smallest domain size",
        "option_c": "Pruning variables that have no connections in the constraint graph",
        "option_d": "Eliminating cycles in non-directed constraint trees",
        "correct_option": "A",
        "explanation": "Once a variable is selected, LCV chooses the value that rules out the fewest choices for remaining unassigned neighbors, maximizing the chances of finding a valid solution without backtracking."
    })
    questions.append({
        "id": "AI-B-46",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Reinforcement Learning",
        "question_text": "What is the primary mechanism of Soft Actor-Critic (SAC)?",
        "option_a": "Maximum entropy reinforcement learning: optimizing a policy to maximize both expected cumulative return and policy entropy H(pi(cdot | s))",
        "option_b": "Restricting actor actions to purely binary discrete choices",
        "option_c": "Eliminating the critic network completely",
        "option_d": "Updating policy parameters using genetic mutations",
        "correct_option": "A",
        "explanation": "SAC optimizes an actor-critic framework under the maximum entropy RL objective, encouraging exploration and preventing policy collapse by rewarding high action distribution entropy."
    })
    questions.append({
        "id": "AI-B-47",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Planning & Decision Theory",
        "question_text": "What is the definition of the 'Value of Perfect Information' (VPI) for an unobserved evidence variable E_j?",
        "option_a": "VPI(E_j) = E [ max_a EU(a | E_j) ] - max_a EU(a), representing the expected utility gain from observing E_j before choosing action a",
        "option_b": "The total financial cost incurred to purchase sensor hardware",
        "option_c": "The Shannon entropy of the observation distribution",
        "option_d": "The minimum reward obtainable in the worst-case state",
        "correct_option": "A",
        "explanation": "VPI measures the difference between expected utility with evidence E_j known and maximum expected utility under current beliefs, quantifying how much observation data is worth."
    })
    questions.append({
        "id": "AI-B-48",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Knowledge Graphs & Embeddings",
        "question_text": "Why does RotatE improve upon TransE in modeling relational patterns in Knowledge Graphs?",
        "option_a": "It models relations as rotations in complex vector space (t = h circ r), naturally capturing symmetry, antisymmetry, inversion, and composition",
        "option_b": "It eliminates complex numbers and uses purely scalar addition",
        "option_c": "It treats all relations as identical equivalence classes",
        "option_d": "It requires no training data",
        "correct_option": "A",
        "explanation": "RotatE defines relations as element-wise rotations in the complex plane (|r_i| = 1), enabling the representation of symmetric (e.g. spouse), antisymmetric, inverse, and composition relationships."
    })
    questions.append({
        "id": "AI-B-49",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "Generative AI",
        "question_text": "In Latent Diffusion Models (like Stable Diffusion), why is diffusion performed in latent space rather than pixel space?",
        "option_a": "A pre-trained autoencoder compresses high-dimensional pixel space into a perceptually equivalent low-dimensional latent space, drastically reducing computational complexity while preserving high fidelity",
        "option_b": "Pixel space diffusion cannot generate color images",
        "option_c": "Latent space forces all image resolutions to be exactly 64x64",
        "option_d": "Pixel space requires quantum computing hardware",
        "correct_option": "A",
        "explanation": "Pixel-space diffusion is computationally prohibitive for high resolutions. Latent Diffusion uses an encoder to project images to an 8x downscaled latent representation, executing diffusion with high efficiency."
    })
    questions.append({
        "id": "AI-B-50",
        "subject": "Artificial Intelligence",
        "set_name": "B",
        "difficulty": "Advanced",
        "topic": "AI Safety & Alignment",
        "question_text": "What is the 'Orthogonality Thesis' formulated by Nick Bostrom in artificial intelligence safety?",
        "option_a": "An artificial intelligence agent can theoretically combine more or less any level of general intelligence with more or less any final goal or value system",
        "option_b": "Neural network weight matrices must remain orthogonal to avoid gradient explosion",
        "option_c": "High intelligence inevitably causes an agent to adopt human moral values",
        "option_d": "Agent utility functions must always be perpendicular to human preferences",
        "correct_option": "A",
        "explanation": "The Orthogonality Thesis asserts that intelligence and final goals are orthogonal variables: superintelligent systems do not automatically converge on benevolence or human ethics without deliberate alignment."
    })

    return questions

