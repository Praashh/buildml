import { prisma } from "~/db";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set.');
}

async function main() {
    const problems = [
        {
            title: 'Xavier Initialization',
            slug: 'xavier-initialization',
            difficulty: 'Medium',
            description: `
Implement Xavier Initialization (also known as Glorot Initialization) for a neural network weight tensor.

Xavier initialization is designed to keep the scale of gradients roughly the same across all layers. For a layer with $n_{in}$ input neurons and $n_{out}$ output neurons, the weights are sampled from a distribution with variance:

$$Var(W) = \\frac{2}{n_{in} + n_{out}}$$

Typically, this is implemented using a normal distribution:
$$W \\sim \\mathcal{N}(0, \\sigma^2)$$
where $\\sigma = \\text{gain} \\times \\sqrt{\\frac{2}{n_{in} + n_{out}}}$

Or a uniform distribution:
$$W \\sim \\mathcal{U}(-a, a)$$
where $a = \\text{gain} \\times \\sqrt{\\frac{6}{n_{in} + n_{out}}}$

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
`
        }
    ];

    for (const problem of problems) {
        await prisma.problem.upsert({
            where: { slug: problem.slug },
            update: problem,
            create: problem,
        });
    }

    console.log('Seed successful');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
