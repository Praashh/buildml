// Problem Set: Neural Networks from Scratch
// Distribution: 2 Easy, 2 Medium, 2 Hard (Total 6 problems)

import { prisma } from "~/db";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set.");
}

async function main() {
	const nnProblemSet = await prisma.problemSet.upsert({
		where: { slug: "neural-networks-from-scratch" },
		update: {
			title: "Neural Networks from Scratch",
			description:
				"Build a complete neural network in pure NumPy. From activation functions to backpropagation — implement the core of deep learning without any frameworks.",
		},
		create: {
			title: "Neural Networks from Scratch",
			slug: "neural-networks-from-scratch",
			description:
				"Build a complete neural network in pure NumPy. From activation functions to backpropagation — implement the core of deep learning without any frameworks.",
		},
	});

	console.log(`Created problem set: ${nnProblemSet.title}`);

	const nnProblems = [
		// === EASY ===
		{
			title: "Sigmoid Activation",
			slug: "nn1_sigmoid",
			difficulty: "Easy",
			order: 1,
			problemSetId: nnProblemSet.id,
			description: `## Sigmoid Activation Function

The **sigmoid** function is one of the most fundamental activation functions in neural networks. It maps any real number to a value between 0 and 1, making it ideal for binary classification output layers.

### Mathematical Formulation

$$\\sigma(x) = \\frac{1}{1 + e^{-x}}$$

The derivative of the sigmoid function has an elegant form:

$$\\sigma'(x) = \\sigma(x) \\cdot (1 - \\sigma(x))$$

### Instructions

Implement two functions:

1. \`sigmoid(x)\` — Compute the sigmoid activation
2. \`sigmoid_derivative(x)\` — Compute the derivative of sigmoid **with respect to x**

**Input:**
- \`x\`: NumPy array of any shape

**Output:**
- Array of the same shape with the function applied element-wise

### Example
\`\`\`python
sigmoid(np.array([0.0]))        # → [0.5]
sigmoid(np.array([100.0]))      # → [~1.0]
sigmoid_derivative(np.array([0.0]))  # → [0.25]
\`\`\`

### Constraints
- Use pure NumPy. No frameworks allowed.
`,
			templateCode: `import numpy as np

def sigmoid(x):
    """
    Compute the sigmoid activation function.

    Args:
        x: np.ndarray of any shape

    Returns:
        np.ndarray of same shape with sigmoid applied element-wise
    """
    # Your code here
    raise NotImplementedError

def sigmoid_derivative(x):
    """
    Compute the derivative of the sigmoid function with respect to x.

    Args:
        x: np.ndarray of any shape

    Returns:
        np.ndarray of same shape
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: nn1_sigmoid.py",
		},
		{
			title: "ReLU Activation",
			slug: "nn2_relu",
			difficulty: "Easy",
			order: 2,
			problemSetId: nnProblemSet.id,
			description: `## ReLU Activation Function

**ReLU** (Rectified Linear Unit) is the most widely used activation function in modern deep learning. It is computationally efficient and helps mitigate the vanishing gradient problem.

### Mathematical Formulation

$$\\text{ReLU}(x) = \\max(0, x)$$

The derivative is:

$$\\text{ReLU}'(x) = \\begin{cases} 1 & \\text{if } x > 0 \\\\ 0 & \\text{if } x \\leq 0 \\end{cases}$$

### Instructions

Implement two functions:

1. \`relu(x)\` — Compute the ReLU activation
2. \`relu_derivative(x)\` — Compute the derivative (use 0 at x=0)

**Input:**
- \`x\`: NumPy array of any shape

**Output:**
- Array of the same shape with the function applied element-wise

### Example
\`\`\`python
relu(np.array([-2.0, 0.0, 3.0]))         # → [0.0, 0.0, 3.0]
relu_derivative(np.array([-2.0, 0.0, 3.0]))  # → [0.0, 0.0, 1.0]
\`\`\`

### Constraints
- Use pure NumPy.
- At x=0, the derivative should be 0.
`,
			templateCode: `import numpy as np

def relu(x):
    """
    Compute the ReLU activation function.

    Args:
        x: np.ndarray of any shape

    Returns:
        np.ndarray of same shape with ReLU applied element-wise
    """
    # Your code here
    raise NotImplementedError

def relu_derivative(x):
    """
    Compute the derivative of ReLU.

    Args:
        x: np.ndarray of any shape

    Returns:
        np.ndarray of same shape (1 where x > 0, else 0)
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: nn2_relu.py",
		},

		// === MEDIUM ===
		{
			title: "Binary Cross-Entropy Loss",
			slug: "nn3_binary_cross_entropy",
			difficulty: "Medium",
			order: 3,
			problemSetId: nnProblemSet.id,
			description: `## Binary Cross-Entropy Loss

Binary cross-entropy (log loss) is the standard loss function for binary classification tasks. It measures the divergence between the predicted probabilities and the true labels.

### Mathematical Formulation

$$\\mathcal{L}(y, \\hat{y}) = -\\frac{1}{m} \\sum_{i=1}^{m} \\left[ y_i \\log(\\hat{y}_i) + (1 - y_i) \\log(1 - \\hat{y}_i) \\right]$$

Where:
- $y$ is the true label (0 or 1)
- $\\hat{y}$ is the predicted probability
- $m$ is the number of samples

### Instructions

Implement \`binary_cross_entropy(y, y_hat)\` that computes the average loss over all samples.

**Inputs:**
- \`y\`: np.ndarray — true labels (0 or 1), shape \`(m,)\`
- \`y_hat\`: np.ndarray — predicted probabilities, shape \`(m,)\`

**Output:**
- Scalar float — the mean binary cross-entropy loss

**Important:** For numerical stability, clip \`y_hat\` to \`[1e-15, 1 - 1e-15]\` before computing the log.

### Example
\`\`\`python
y     = np.array([1.0, 0.0])
y_hat = np.array([0.9, 0.1])
binary_cross_entropy(y, y_hat)  # → ~0.1054
\`\`\`
`,
			templateCode: `import numpy as np

def binary_cross_entropy(y, y_hat):
    """
    Compute binary cross-entropy loss.

    Args:
        y: np.ndarray (m,) — true labels (0 or 1)
        y_hat: np.ndarray (m,) — predicted probabilities

    Returns:
        float — mean binary cross-entropy loss
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: nn3_binary_cross_entropy.py",
		},
		{
			title: "Linear Layer Forward",
			slug: "nn4_linear_forward",
			difficulty: "Medium",
			order: 4,
			problemSetId: nnProblemSet.id,
			description: `## Linear (Dense) Layer — Forward Pass

A linear layer (also called a fully connected or dense layer) is the fundamental building block of neural networks. It performs an affine transformation on the input.

### Mathematical Formulation

$$Z = X W + b$$

Where:
- $X$ is the input matrix of shape $(m, n_{in})$
- $W$ is the weight matrix of shape $(n_{in}, n_{out})$
- $b$ is the bias vector of shape $(n_{out},)$
- $Z$ is the output of shape $(m, n_{out})$

### Instructions

Implement \`linear_forward(X, W, b)\` that computes the forward pass.

**Inputs:**
- \`X\`: np.ndarray of shape \`(m, n_in)\` — input batch
- \`W\`: np.ndarray of shape \`(n_in, n_out)\` — weights
- \`b\`: np.ndarray of shape \`(n_out,)\` — biases

**Output:**
- np.ndarray of shape \`(m, n_out)\`

### Example
\`\`\`python
X = np.array([[1.0, 2.0]])         # (1, 2)
W = np.array([[0.5], [0.5]])       # (2, 1)
b = np.array([0.1])                # (1,)
linear_forward(X, W, b)            # → [[1.6]]
\`\`\`
`,
			templateCode: `import numpy as np

def linear_forward(X, W, b):
    """
    Forward pass of a linear (dense) layer.

    Args:
        X: Input (m, n_in)
        W: Weights (n_in, n_out)
        b: Biases (n_out,)

    Returns:
        Output (m, n_out)
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: nn4_linear_forward.py",
		},

		// === HARD ===
		{
			title: "Linear Layer Backward",
			slug: "nn5_linear_backward",
			difficulty: "Hard",
			order: 5,
			problemSetId: nnProblemSet.id,
			description: `## Linear Layer — Backward Pass (Backpropagation)

Backpropagation computes the gradients of the loss with respect to each parameter. For a linear layer $Z = XW + b$, given the upstream gradient $\\frac{\\partial \\mathcal{L}}{\\partial Z}$ (denoted \`dZ\`), we compute:

### Mathematical Formulation

$$\\frac{\\partial \\mathcal{L}}{\\partial W} = \\frac{1}{m} X^T \\cdot dZ$$

$$\\frac{\\partial \\mathcal{L}}{\\partial b} = \\frac{1}{m} \\sum_{i=1}^{m} dZ_i$$

$$\\frac{\\partial \\mathcal{L}}{\\partial X} = dZ \\cdot W^T$$

### Instructions

Implement \`linear_backward(dZ, X, W)\` that returns gradients \`(dW, db, dX)\`.

**Inputs:**
- \`dZ\`: np.ndarray \`(m, n_out)\` — gradient from upstream
- \`X\`: np.ndarray \`(m, n_in)\` — input from forward pass
- \`W\`: np.ndarray \`(n_in, n_out)\` — weight matrix

**Output:**
- Tuple \`(dW, db, dX)\`:
  - \`dW\`: shape \`(n_in, n_out)\`
  - \`db\`: shape \`(n_out,)\`
  - \`dX\`: shape \`(m, n_in)\`

### Example
\`\`\`python
dZ = np.array([[1.0, -1.0]])       # (1, 2)
X  = np.array([[1.0, 2.0]])        # (1, 2)
W  = np.array([[0.5, -0.3],        # (2, 2)
               [0.2,  0.8]])
dW, db, dX = linear_backward(dZ, X, W)
# dW = [[1.0, -1.0], [2.0, -2.0]]
# db = [1.0, -1.0]
# dX = [[0.8, -0.6]]
\`\`\`
`,
			templateCode: `import numpy as np

def linear_backward(dZ, X, W):
    """
    Backward pass of a linear layer.

    Args:
        dZ: Upstream gradient (m, n_out)
        X: Input from forward pass (m, n_in)
        W: Weight matrix (n_in, n_out)

    Returns:
        dW: Gradient for weights (n_in, n_out)
        db: Gradient for biases (n_out,)
        dX: Gradient for input (m, n_in)
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: nn5_linear_backward.py",
		},
		{
			title: "Two-Layer Neural Network",
			slug: "nn6_two_layer_nn",
			difficulty: "Hard",
			order: 6,
			problemSetId: nnProblemSet.id,
			description: `## Two-Layer Neural Network

This is the capstone challenge. Combine everything you've built into a complete 2-layer neural network for binary classification.

### Architecture

\`\`\`
Input (m, n_input)
  → Linear Layer 1: Z1 = X @ W1 + b1
  → ReLU: A1 = relu(Z1)
  → Linear Layer 2: Z2 = A1 @ W2 + b2
  → Sigmoid: y_hat = sigmoid(Z2)
  → Binary Cross-Entropy Loss
\`\`\`

### Instructions

Implement three functions:

1. **\`initialize_network(n_input, n_hidden, n_output)\`**
   - Returns a dict with keys: \`W1\`, \`b1\`, \`W2\`, \`b2\`
   - \`W1\`: shape \`(n_input, n_hidden)\` — random small values (e.g., \`np.random.randn(...) * 0.01\`)
   - \`b1\`: shape \`(n_hidden,)\` — zeros
   - \`W2\`: shape \`(n_hidden, n_output)\` — random small values
   - \`b2\`: shape \`(n_output,)\` — zeros

2. **\`forward(X, params)\`**
   - Performs forward pass through both layers
   - Returns \`y_hat\` of shape \`(m, n_output)\`

3. **\`train(X, y, params, lr=0.01, epochs=1000)\`**
   - Trains the network using gradient descent
   - Returns updated \`params\` dict
   - Uses ReLU for hidden layer, Sigmoid for output
   - Uses Binary Cross-Entropy loss

### Example
\`\`\`python
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[1],[1],[0]], dtype=float)  # XOR

params = initialize_network(2, 8, 1)
params = train(X, y, params, lr=0.5, epochs=2000)
pred = forward(X, params)
# pred should be close to y
\`\`\`

### Constraints
- Pure NumPy only.
- Time limit: 30 seconds.
`,
			templateCode: `import numpy as np

def initialize_network(n_input, n_hidden, n_output):
    """
    Initialize a 2-layer neural network.

    Returns:
        dict with keys W1, b1, W2, b2
    """
    # Your code here
    raise NotImplementedError

def forward(X, params):
    """
    Forward pass through the 2-layer network.

    Args:
        X: Input (m, n_input)
        params: dict with W1, b1, W2, b2

    Returns:
        y_hat: Predictions (m, n_output)
    """
    # Your code here
    raise NotImplementedError

def train(X, y, params, lr=0.01, epochs=1000):
    """
    Train the network using gradient descent.

    Args:
        X: Training data (m, n_input)
        y: Labels (m, n_output)
        params: Network parameters
        lr: Learning rate
        epochs: Number of training iterations

    Returns:
        Updated params dict
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: nn6_two_layer_nn.py",
		},
	];

	for (const problem of nnProblems) {
		await prisma.problem.upsert({
			where: { slug: problem.slug },
			update: problem,
			create: problem,
		});
	}

	console.log(
		`Seeded ${nnProblems.length} problems for "${nnProblemSet.title}"`,
	);
	console.log("Seed successful");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
