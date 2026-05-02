import { prisma } from "~/db";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set.");
}

async function main() {
	// ─── Problem Set: Attention Is All You Need ───────────────────────
	const attentionPaperSet = await prisma.problemSet.upsert({
		where: { slug: "attention-is-all-you-need" },
		update: {
			title: "Attention Is All You Need",
			description:
				"Implement the core building blocks of the Transformer architecture from the landmark paper. Build positional encodings, attention mechanisms, and a full encoder forward pass — all in pure NumPy.",
		},
		create: {
			title: "Attention Is All You Need",
			slug: "attention-is-all-you-need",
			description:
				"Implement the core building blocks of the Transformer architecture from the landmark paper. Build positional encodings, attention mechanisms, and a full encoder forward pass — all in pure NumPy.",
		},
	});

	console.log(`Created problem set: ${attentionPaperSet.title}`);

	const attentionProblems = [
		{
			title: "Positional Encoding",
			slug: "a1_positional_encoding",
			difficulty: "Easy",
			order: 1,
			problemSetId: attentionPaperSet.id,
			description: `## Positional Encoding

The Transformer model, unlike RNNs, contains no recurrence and no convolution. In order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. To this end, we add **positional encodings** to the input embeddings at the bottoms of the encoder and decoder stacks.

### Mathematical Formulation

The positional encoding $PE$ is a matrix of shape $(L, d_{model})$ where $L$ is the sequence length. The values are defined as:

$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right)$$

$$PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d_{model}}}\\right)$$

**Where:**
- $pos$ is the position ($0 \\leq pos < L$)
- $i$ is the dimension index ($0 \\leq 2i < d_{model}$)

### Instructions

Implement the function \`positional_encoding(seq_len, d_model)\` that returns the positional encoding matrix.

**Input:**
- \`seq_len\` (int): Length of the sequence.
- \`d_model\` (int): Dimensionality of the model embeddings.

**Output:**
- A NumPy array of shape \`(seq_len, d_model)\` and dtype \`float32\`.

**Constraints:**
- \`d_model\` is an even integer.
- Use pure NumPy. PyTorch/JAX are not allowed.

### Example
\`\`\`python
pe = positional_encoding(seq_len=4, d_model=4)
# Returns shape (4, 4)
# PE[0] should be [0., 1., 0., 1.]  (sin(0), cos(0), sin(0), cos(0))
\`\`\`
`,
			templateCode: `import numpy as np

def positional_encoding(seq_len: int, d_model: int) -> np.ndarray:
    """
    Compute sinusoidal positional encodings.

    Args:
        seq_len: Length of the sequence (L)
        d_model: Dimensionality of the model (must be even)

    Returns:
        np.ndarray of shape (seq_len, d_model), dtype float32
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: a1_positional_encoding.py",
		},
		{
			title: "Scaled Dot-Product Attention",
			slug: "a2_scaled_attention",
			difficulty: "Easy",
			order: 2,
			problemSetId: attentionPaperSet.id,
			description: `## Scaled Dot-Product Attention

The core building block of the Transformer is the attention mechanism. The input consists of queries ($Q$) and keys ($K$) of dimension $d_k$, and values ($V$) of dimension $d_v$.

### Mathematical Formulation

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

**Shapes:**
- $Q$: $(batch, seq\\_q, d_k)$
- $K$: $(batch, seq\\_k, d_k)$
- $V$: $(batch, seq\\_k, d_v)$
- $mask$: Optional, broadcastable to $(batch, seq\\_q, seq\\_k)$

If a mask is provided, add it to the scaled scores before softmax (use large negative values like $-10^9$ for masked positions).

### Instructions

Implement \`scaled_dot_product_attention(q, k, v, mask=None)\`.

**Returns a tuple of:**
- \`output\`: Context vectors, shape $(batch, seq\\_q, d_v)$
- \`weights\`: Attention weights (after softmax), shape $(batch, seq\\_q, seq\\_k)$

### Example
\`\`\`python
q = np.array([[[1., 0.]]])  # (1, 1, 2)
k = np.array([[[1., 0.]]])  # (1, 1, 2)
v = np.array([[[10., 20.]]])  # (1, 1, 2)

out, w = scaled_dot_product_attention(q, k, v)
# w → [[[1.]]]
# out → [[[10., 20.]]]
\`\`\`
`,
			templateCode: `import numpy as np

def scaled_dot_product_attention(q, k, v, mask=None):
    """
    Compute scaled dot-product attention.

    Args:
        q: Query tensor (batch, seq_q, d_k)
        k: Key tensor (batch, seq_k, d_k)
        v: Value tensor (batch, seq_k, d_v)
        mask: Optional mask broadcastable to (batch, seq_q, seq_k)

    Returns:
        output: (batch, seq_q, d_v)
        weights: (batch, seq_q, seq_k)
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: a2_scaled_attention.py",
		},
		{
			title: "Single Attention Head",
			slug: "a3_single_attention_head",
			difficulty: "Medium",
			order: 3,
			problemSetId: attentionPaperSet.id,
			description: `## Single Attention Head (Projection)

In the Transformer model, we first project the inputs $X$ into subspaces using learnable linear projections ($W^Q, W^K, W^V$).

### Mathematical Formulation

$$Q = X W^Q, \\quad K = X W^K, \\quad V = X W^V$$
$$\\text{Head} = \\text{Attention}(Q, K, V)$$

### Instructions

Implement \`single_attention_head(x_q, x_k, x_v, W_q, W_k, W_v)\`.

**Inputs:**
- \`x_q, x_k, x_v\`: Input tensors, shape $(batch, seq, d_{model})$
- \`W_q, W_k\`: Weight matrices, shape $(d_{model}, d_k)$
- \`W_v\`: Weight matrix, shape $(d_{model}, d_v)$

**Output:**
- Attention output, shape $(batch, seq, d_v)$. Do **not** return weights.

**Note:** You should reuse your \`scaled_dot_product_attention\` logic.

### Constraints
- Use pure NumPy.
- Assume inputs match dimensions for matrix multiplication.
`,
			templateCode: `import numpy as np

def single_attention_head(x_q, x_k, x_v, W_q, W_k, W_v):
    """
    Single attention head with linear projections.

    Args:
        x_q: Query input (batch, seq, d_model)
        x_k: Key input (batch, seq, d_model)
        x_v: Value input (batch, seq, d_model)
        W_q: Query projection (d_model, d_k)
        W_k: Key projection (d_model, d_k)
        W_v: Value projection (d_model, d_v)

    Returns:
        Output tensor (batch, seq, d_v)
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: a3_single_attention_head.py",
		},
		{
			title: "Multi-Head Attention",
			slug: "a4_multi_head_attention",
			difficulty: "Hard",
			order: 4,
			problemSetId: attentionPaperSet.id,
			description: `## Multi-Head Attention

Instead of performing a single attention function, we project queries, keys and values $h$ times and perform attention in parallel.

### Mathematical Formulation

$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, ..., \\text{head}_h) W^O$$

where $\\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$

### Instructions

Implement \`multi_head_attention(x, num_heads, W_q, W_k, W_v, W_o)\`.

**Inputs:**
- \`x\`: Input tensor $(batch, seq, d_{model})$ — self-attention, so $Q = K = V = x$
- \`num_heads\`: Integer $h$
- \`W_q, W_k, W_v\`: Projection weights $(d_{model}, d_{model})$
- \`W_o\`: Output projection $(d_{model}, d_{model})$

**Logic Steps:**
1. Project $x$ using $W_q, W_k, W_v$
2. Split last dim into $(h, d_k)$ where $d_k = d_{model}/h$
3. Transpose to $(batch, h, seq, d_k)$
4. Compute scaled dot-product attention
5. Transpose back and concatenate heads
6. Apply final projection $W_o$

**Output:** $(batch, seq, d_{model})$
`,
			templateCode: `import numpy as np

def multi_head_attention(x, num_heads, W_q, W_k, W_v, W_o):
    """
    Multi-head self-attention.

    Args:
        x: Input (batch, seq, d_model)
        num_heads: Number of attention heads
        W_q, W_k, W_v: Projection weights (d_model, d_model)
        W_o: Output projection (d_model, d_model)

    Returns:
        Output (batch, seq, d_model)
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: a4_multi_head_attention.py",
		},
		{
			title: "Layer Normalization",
			slug: "a5_layer_norm",
			difficulty: "Easy",
			order: 5,
			problemSetId: attentionPaperSet.id,
			description: `## Layer Normalization

The Transformer uses Layer Normalization after each sub-layer. It normalizes activations within a layer for a single training case.

### Mathematical Formulation

$$\\mu = \\frac{1}{d} \\sum_{i=1}^{d} x_i$$

$$\\sigma^2 = \\frac{1}{d} \\sum_{i=1}^{d} (x_i - \\mu)^2$$

$$\\text{LayerNorm}(x) = \\frac{x - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}}$$

For this task, implement normalization only (no learnable $\\gamma, \\beta$).

### Instructions

Implement \`layer_norm(x, eps=1e-5)\`.

**Input:**
- \`x\`: NumPy array of any shape. Normalize over the **last dimension**.
- \`eps\`: Small float for numerical stability.

**Output:** Normalized array of same shape.

### Example
\`\`\`python
x = np.array([[1.0, 2.0, 3.0]])
# mean=2.0, var=0.66...
# output should have mean ≈ 0 and var ≈ 1
\`\`\`
`,
			templateCode: `import numpy as np

def layer_norm(x, eps=1e-5):
    """
    Layer normalization over the last dimension.

    Args:
        x: Input array of any shape
        eps: Small float for numerical stability

    Returns:
        Normalized array of same shape
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: a5_layer_norm.py",
		},
		{
			title: "Tiny Transformer Forward Pass",
			slug: "a6_tiny_transformer",
			difficulty: "Hard",
			order: 6,
			problemSetId: attentionPaperSet.id,
			description: `## Tiny Transformer Forward Pass

This is the final integration task. Combine positional encoding, multi-head attention, and layer norm into a complete Transformer encoder forward pass.

### Instructions

Implement \`transformer_forward(x, pos_encoding, W_q, W_k, W_v, W_o, W_ff1, W_ff2, num_heads)\`.

**Steps:**
1. **Input Processing:** Add positional encoding to input embeddings
2. **Multi-Head Attention:** Apply self-attention → residual connection → layer norm
3. **Feed-Forward Network:**
   - First layer: \`relu(x @ W_ff1)\`
   - Second layer: \`result @ W_ff2\`
   - Residual connection → layer norm
4. **Return** output of shape $(batch, seq, d_{model})$

### Signature
\`\`\`python
def transformer_forward(x, pos_encoding, W_q, W_k, W_v, W_o, W_ff1, W_ff2, num_heads):
    pass
\`\`\`

**Constraints:** NumPy only. Time limit: 10 seconds.
`,
			templateCode: `import numpy as np

def transformer_forward(x, pos_encoding, W_q, W_k, W_v, W_o, W_ff1, W_ff2, num_heads):
    """
    Forward pass through a Transformer encoder block.

    Args:
        x: Input embeddings (batch_size, seq_len, d_model)
        pos_encoding: Positional encoding (seq_len, d_model)
        W_q, W_k, W_v, W_o: Attention weight matrices
        W_ff1, W_ff2: Feed-forward weight matrices
        num_heads: Number of attention heads

    Returns:
        Output of shape (batch_size, seq_len, d_model)
    """
    # Your code here — use your implementations from previous tasks
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: a6_tiny_transformer.py",
		},
	];

	for (const problem of attentionProblems) {
		await prisma.problem.upsert({
			where: { slug: problem.slug },
			update: problem,
			create: problem,
		});
	}

	console.log(
		`Seeded ${attentionProblems.length} problems for "${attentionPaperSet.title}"`,
	);

	// ─── Problem Set: ML Fundamentals (existing) ────────────────────
	const mlFundamentals = await prisma.problemSet.upsert({
		where: { slug: "ml-fundamentals" },
		update: {
			title: "Machine Learning Fundamentals",
			description:
				"Core concepts every ML engineer should master. From initialization techniques to optimization algorithms.",
		},
		create: {
			title: "Machine Learning Fundamentals",
			slug: "ml-fundamentals",
			description:
				"Core concepts every ML engineer should master. From initialization techniques to optimization algorithms.",
		},
	});

	console.log(`Created problem set: ${mlFundamentals.title}`);

	const mlProblems = [
		{
			title: "Xavier Initialization",
			slug: "xavier-initialization",
			difficulty: "Medium",
			order: 1,
			problemSetId: mlFundamentals.id,
			description: `
Implement Xavier Initialization (also known as Glorot Initialization) for a neural network weight tensor.

Xavier initialization is designed to keep the scale of gradients roughly the same across all layers. For a layer with $n_{in}$ input neurons and $n_{out}$ output neurons, the weights are sampled from a distribution with variance:

$$Var(W) = \\\\frac{2}{n_{in} + n_{out}}$$

Typically, this is implemented using a normal distribution:
$$W \\\\sim \\\\mathcal{N}(0, \\\\sigma^2)$$
where $\\\\sigma = \\\\text{gain} \\\\times \\\\sqrt{\\\\frac{2}{n_{in} + n_{out}}}$

For this problem, use the **Normal Distribution** approach.

### Function Signature
\`\`\`python
def xavier_init(shape, gain=1.0):
    """
    shape: tuple - shape of the weight tensor (n_out, n_in)
    gain: float - scaling factor
    returns: np.ndarray of specified shape, dtype=np.float32
    """
\`\`\`
      `,
			templateCode: `import numpy as np

def xavier_init(shape, gain=1.0):
    """
    shape: tuple - (n_out, n_in)
    gain: float - scaling factor
    returns: np.ndarray of specified shape, dtype=np.float32
    """
    # Your code here
    raise NotImplementedError
`,
			testCode: `
import numpy as np
from solution import xavier_init

def test():
    shape = (100, 100)
    gain = 1.0
    weights = xavier_init(shape, gain)
    
    # Check shape
    assert weights.shape == shape, f"Expected shape {shape}, got {weights.shape}"
    
    # Check dtype
    assert weights.dtype == np.float32, f"Expected dtype float32, got {weights.dtype}"
    
    # Check statistical properties
    n_out, n_in = shape
    expected_std = gain * np.sqrt(2.0 / (n_in + n_out))
    actual_std = np.std(weights)
    
    # Allow for some statistical variance
    assert np.abs(actual_std - expected_std) < 0.05, f"Expected std ~{expected_std:.4f}, got {actual_std:.4f}"
    
    # Check mean is close to 0
    actual_mean = np.mean(weights)
    assert np.abs(actual_mean) < 0.05, f"Expected mean ~0, got {actual_mean:.4f}"

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
		{
			title: "He Initialization",
			slug: "he-initialization",
			difficulty: "Medium",
			order: 2,
			problemSetId: mlFundamentals.id,
			description: `
Implement He Initialization (also known as Kaiming Initialization) for ReLU-activated neural networks.

He initialization accounts for the fact that ReLU neurons kill half of their inputs (negative values become 0). For a layer with $n_{in}$ input neurons, the weights are sampled with variance:

$$Var(W) = \\\\frac{2}{n_{in}}$$

This is typically implemented using a normal distribution:
$$W \\\\sim \\\\mathcal{N}(0, \\\\sigma^2)$$
where $\\\\sigma = \\\\text{gain} \\\\times \\\\sqrt{\\\\frac{2}{n_{in}}}$

For ReLU activation, the recommended gain is $\\\\sqrt{2}$.

### Function Signature
\`\`\`python
def he_init(shape, gain=np.sqrt(2)):
    """
    shape: tuple - shape of the weight tensor (n_out, n_in)
    gain: float - scaling factor (default sqrt(2) for ReLU)
    returns: np.ndarray of specified shape, dtype=np.float32
    """
\`\`\`
      `,
			templateCode: `import numpy as np

def he_init(shape, gain=np.sqrt(2)):
    """
    shape: tuple - (n_out, n_in)
    gain: float - scaling factor (default sqrt(2) for ReLU)
    returns: np.ndarray of specified shape, dtype=np.float32
    """
    # Your code here
    raise NotImplementedError
`,
			testCode: `
import numpy as np
from solution import he_init

def test():
    shape = (100, 100)
    gain = np.sqrt(2)
    weights = he_init(shape, gain)
    
    # Check shape
    assert weights.shape == shape, f"Expected shape {shape}, got {weights.shape}"
    
    # Check dtype
    assert weights.dtype == np.float32, f"Expected dtype float32, got {weights.dtype}"
    
    # Check statistical properties
    n_out, n_in = shape
    expected_std = gain * np.sqrt(2.0 / n_in)
    actual_std = np.std(weights)
    
    # Allow for some statistical variance
    assert np.abs(actual_std - expected_std) < 0.05, f"Expected std ~{expected_std:.4f}, got {actual_std:.4f}"
    
    # Check mean is close to 0
    actual_mean = np.mean(weights)
    assert np.abs(actual_mean) < 0.05, f"Expected mean ~0, got {actual_mean:.4f}"

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
		{
			title: "Softmax Function",
			slug: "softmax-function",
			difficulty: "Easy",
			order: 3,
			problemSetId: mlFundamentals.id,
			description: `
Implement the Softmax function, which converts a vector of real numbers into a probability distribution.

The softmax function is defined as:
$$\\\\text{softmax}(x_i) = \\\\frac{e^{x_i}}{\\\\sum_{j} e^{x_j}}$$

For numerical stability, subtract the maximum value before computing:
$$\\\\text{softmax}(x_i) = \\\\frac{e^{x_i - \\\\max(x)}}{\\\\sum_{j} e^{x_j - \\\\max(x)}}$$

### Function Signature
\`\`\`python
def softmax(x):
    """
    x: np.ndarray - input array (1D or 2D, apply along last axis)
    returns: np.ndarray of same shape with softmax applied
    """
\`\`\`
      `,
			templateCode: `import numpy as np

def softmax(x):
    """
    x: np.ndarray - input array (1D or 2D, apply along last axis)
    returns: np.ndarray of same shape with softmax applied
    """
    # Your code here
    raise NotImplementedError
`,
			testCode: `
import numpy as np
from solution import softmax

def test():
    # Test 1D
    x = np.array([1.0, 2.0, 3.0])
    result = softmax(x)
    
    assert result.shape == x.shape, f"Shape mismatch"
    assert np.allclose(np.sum(result), 1.0), f"Does not sum to 1"
    assert np.all(result > 0), f"Contains non-positive values"
    
    # Test 2D
    x2d = np.array([[1.0, 2.0, 3.0], [1.0, 1.0, 1.0]])
    result2d = softmax(x2d)
    
    assert result2d.shape == x2d.shape, f"2D shape mismatch"
    assert np.allclose(np.sum(result2d, axis=-1), [1.0, 1.0]), f"2D does not sum to 1 along axis"
    
    # Test numerical stability
    x_large = np.array([1000.0, 1001.0, 1002.0])
    result_large = softmax(x_large)
    assert not np.any(np.isnan(result_large)), f"NaN in result for large values"
    assert not np.any(np.isinf(result_large)), f"Inf in result for large values"

    print("SUCCESS")

if __name__ == "__main__":
    test()
`,
		},
	];

	for (const problem of mlProblems) {
		await prisma.problem.upsert({
			where: { slug: problem.slug },
			update: problem,
			create: problem,
		});
	}

	console.log(
		`Seeded ${mlProblems.length} problems for "${mlFundamentals.title}"`,
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
