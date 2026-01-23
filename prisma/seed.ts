import { prisma } from "~/db";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set.");
}

async function main() {
	// Create problem sets first
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

	const problems = [
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

Or a uniform distribution:
$$W \\\\sim \\\\mathcal{U}(-a, a)$$
where $a = \\\\text{gain} \\\\times \\\\sqrt{\\\\frac{6}{n_{in} + n_{out}}}$

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

	for (const problem of problems) {
		await prisma.problem.upsert({
			where: { slug: problem.slug },
			update: problem,
			create: problem,
		});
	}

	console.log(`Seeded ${problems.length} problems`);
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
