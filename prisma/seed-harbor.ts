import { prisma } from "~/db";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set.");
}

async function main() {
	const harborProblemSet = await prisma.problemSet.upsert({
		where: { slug: "harbor-agent-evals" },
		update: {
			title: "Authoring Harbor Agent Evals",
			description:
				"Master containerized agent benchmarking using the Harbor evaluation framework. Learn to write test.sh verifiers, system state assertions, anti-cheat checks, and full task bundle generators.",
		},
		create: {
			title: "Authoring Harbor Agent Evals",
			slug: "harbor-agent-evals",
			description:
				"Master containerized agent benchmarking using the Harbor evaluation framework. Learn to write test.sh verifiers, system state assertions, anti-cheat checks, and full task bundle generators.",
		},
	});

	console.log(`Created problem set: ${harborProblemSet.title}`);

	const harborProblems = [
		{
			title: "Basic Harbor Verifier Script",
			slug: "harbor1_basic_verifier",
			difficulty: "Easy",
			order: 1,
			problemSetId: harborProblemSet.id,
			description: `## Basic Harbor Verifier Script

**Harbor** is an open-source evaluation container framework behind benchmarks like **Terminal-Bench** and **SWE-bench**. In Harbor, after an agent attempts a task inside a Docker container, Harbor runs \`tests/test.sh\` to evaluate the container's state and write a numeric score to \`/logs/verifier/reward.txt\`.

### Instructions

Implement two functions:
1. \`generate_harbor_verifier(config_path, expected_key, expected_val)\`: Returns a bash \`test.sh\` script string for Harbor.
   - The script must check if \`config_path\` exists and contains a JSON object where \`expected_key == expected_val\`.
   - Ensure \`/logs/verifier\` directory exists.
   - Write \`1.0\\n\` on success or \`0.0\\n\` on failure to \`/logs/verifier/reward.txt\`.
2. \`parse_harbor_reward(reward_file_content)\`: Parses string content from \`/logs/verifier/reward.txt\`.
   - Returns a dict with \`reward\` (float), \`passed\` (bool: True if reward >= 0.75), and optional \`error\` string if parsing fails.

### Example

\`\`\`python
script = generate_harbor_verifier("/etc/app/config.json", "status", "active")
# Returns a bash script string starting with '#!/bin/bash'

res = parse_harbor_reward("1.0\\n")
# Returns {"reward": 1.0, "passed": True}
\`\`\`
`,
			templateCode: `import json

def generate_harbor_verifier(config_path: str, expected_key: str, expected_val: str) -> str:
    """
    Returns a bash test.sh script string for Harbor.

    Args:
        config_path: Path to configuration file inside container
        expected_key: Key expected in config JSON
        expected_val: Expected value for key

    Returns:
        String containing full bash test.sh script
    """
    # Your code here
    raise NotImplementedError

def parse_harbor_reward(reward_file_content: str) -> dict:
    """
    Parses raw string content from /logs/verifier/reward.txt.

    Args:
        reward_file_content: Raw string content read from reward.txt

    Returns:
        dict with:
            - reward (float): 0.0 to 1.0
            - passed (bool): True if reward >= 0.75
            - error (str, optional): Included if float conversion fails
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: harbor1_basic_verifier.py",
		},
		{
			title: "Python Environment & Dependency Verifier",
			slug: "harbor2_dependency_verifier",
			difficulty: "Easy",
			order: 2,
			problemSetId: harborProblemSet.id,
			description: `## Python Environment & Dependency Verifier

Terminal-Bench style tasks often require agents to fix broken Python environments, resolve dependency conflicts, or configure environment variables.

### Instructions

Implement \`verify_python_environment(installed_packages, required_packages, env_vars, expected_env_vars)\`.

**Inputs:**
- \`installed_packages\` (dict): Map of installed package names to version strings (e.g., \`{"pandas": "2.1.0"}\`)
- \`required_packages\` (dict): Map of required packages to minimum version strings (e.g., \`{"pandas": "2.0.0"}\`)
- \`env_vars\` (dict): Current environment variables
- \`expected_env_vars\` (dict): Expected environment variables and required values

**Returns a tuple of:**
- \`reward\` (float): \`1.0\` if all requirements pass; otherwise fractional score or \`0.0\`.
- \`logs\` (list[str]): Detailed assertion strings explaining passed and failed checks.
`,
			templateCode: `def verify_python_environment(
    installed_packages: dict[str, str],
    required_packages: dict[str, str],
    env_vars: dict[str, str],
    expected_env_vars: dict[str, str]
) -> tuple[float, list[str]]:
    """
    Verifies installed python packages and environment variables against required constraints.

    Returns:
        tuple (reward: float, logs: list[str])
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: harbor2_dependency_verifier.py",
		},
		{
			title: "Codebase Bugfix & Test Suite Verifier",
			slug: "harbor3_codebase_bugfix",
			difficulty: "Medium",
			order: 3,
			problemSetId: harborProblemSet.id,
			description: `## Codebase Bugfix & Test Suite Verifier

In **SWE-bench** and **Harbor** software engineering tasks, agents modify code repositories to fix specific bugs. A verifier must ensure:
1. Target bugfix test cases pass.
2. No pre-existing unit tests broke (**zero regressions**).

### Instructions

Implement \`evaluate_pytest_results(pytest_output, target_test_names)\`.

**Inputs:**
- \`pytest_output\` (str): Raw terminal stdout produced by running \`pytest\`.
- \`target_test_names\` (list[str]): List of test function names corresponding to the targeted bugfix.

**Output dict:**
- \`target_passed\` (int): Count of target tests that passed.
- \`total_targets\` (int): Total count of target tests.
- \`regressions\` (int): Count of non-target (pre-existing) tests that failed.
- \`reward\` (float): \`1.0\` if all targets pass and regressions == 0; \`0.0\` if regressions > 0; otherwise fractional (\`target_passed / total_targets\`).
`,
			templateCode: `def evaluate_pytest_results(pytest_output: str, target_test_names: list[str]) -> dict:
    """
    Parses pytest stdout and evaluates target bugfix tests and regressions.

    Returns:
        dict with keys: target_passed, total_targets, regressions, reward
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: harbor3_codebase_bugfix.py",
		},
		{
			title: "Anti-Cheat & File Integrity Verifier",
			slug: "harbor4_anti_cheat_verifier",
			difficulty: "Medium",
			order: 4,
			problemSetId: harborProblemSet.id,
			description: `## Anti-Cheat & File Integrity Verifier

Autonomous agents can sometimes "reward-hack"—modifying test scripts, tampering with verifiers, or directly executing \`echo 1.0 > /logs/verifier/reward.txt\` to fake task completion.

### Instructions

Implement \`anti_cheat_harbor_verifier(original_hashes, current_files, command_history)\`.

**Inputs:**
- \`original_hashes\` (dict): Map of relative file paths to expected SHA-256 hashes.
- \`current_files\` (dict): Map of relative file paths to current file hashes.
- \`command_history\` (list[str]): List of shell commands executed by the agent.

**Returns dict:**
- \`tampered_files\` (list[str]): Paths whose hashes do not match original hashes.
- \`cheat_detected\` (bool): \`True\` if files tampered OR direct write to \`/logs/verifier/reward.txt\` is detected in command history.
- \`final_reward\` (float): \`0.0\` if cheat detected, otherwise \`1.0\`.
`,
			templateCode: `def anti_cheat_harbor_verifier(
    original_hashes: dict[str, str],
    current_files: dict[str, str],
    command_history: list[str]
) -> dict:
    """
    Detects file tampering or reward hacking in Harbor runs.

    Returns:
        dict with keys: tampered_files, cheat_detected, final_reward
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: harbor4_anti_cheat_verifier.py",
		},
		{
			title: "Terminal & Database State Verifier",
			slug: "harbor5_state_verifier",
			difficulty: "Hard",
			order: 5,
			problemSetId: harborProblemSet.id,
			description: `## Terminal & Database State Verifier

Complex DevOps tasks require verifying multiple layers of system state: running processes, log file keywords, and database table records.

### Instructions

Implement \`verify_harbor_system_state(processes, log_entries, db_records, required_process, expected_log_keyword, required_records)\`.

**Inputs:**
- \`processes\` (list[str]): List of active process names/command lines.
- \`log_entries\` (list[str]): List of log lines from application log files.
- \`db_records\` (list[dict]): List of dictionary records in the database table.
- \`required_process\` (str): Substring required to be in active processes.
- \`expected_log_keyword\` (str): Keyword required in at least one log entry.
- \`required_records\` (list[dict]): List of record dicts required to be present in database.

**Returns tuple:**
- \`reward\` (float): \`1.0\` if process running, log keyword present, and all required records present; else \`0.0\`.
- \`logs\` (list[str]): Log messages describing pass/fail status for each check.
`,
			templateCode: `def verify_harbor_system_state(
    processes: list[str],
    log_entries: list[str],
    db_records: list[dict],
    required_process: str,
    expected_log_keyword: str,
    required_records: list[dict]
) -> tuple[float, list[str]]:
    """
    Verifies system process list, log output, and database record state.

    Returns:
        tuple (reward: float, logs: list[str])
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: harbor5_state_verifier.py",
		},
		{
			title: "Harbor Task Bundle Generator",
			slug: "harbor6_task_bundle_generator",
			difficulty: "Hard",
			order: 6,
			problemSetId: harborProblemSet.id,
			description: `## Harbor Task Bundle Generator

Harbor benchmarks consist of standardized task directories containing configuration, instructions, environment Dockerfiles, and verifier scripts.

### Instructions

Implement \`create_harbor_task_bundle(task_name, instruction, setup_cmd, verifier_code, timeout_sec=120)\`.

**Inputs:**
- \`task_name\` (str): Task identifier.
- \`instruction\` (str): Problem prompt for agent.
- \`setup_cmd\` (str): Docker setup command.
- \`verifier_code\` (str): Python code for \`verifier.py\`.
- \`timeout_sec\` (int): Timeout in seconds for verifier execution.

**Returns dict:** Mapping relative file path to string content:
- \`"task.toml"\`: TOML configuration with task name and \`timeout_sec\`.
- \`"instruction.md"\`: Markdown instruction.
- \`"environment/Dockerfile"\`: Dockerfile containing \`setup_cmd\`.
- \`"tests/test.sh"\`: Bash script executing \`verifier.py\` and outputting reward to \`/logs/verifier/reward.txt\`.
- \`"tests/verifier.py"\`: Python script containing \`verifier_code\`.
`,
			templateCode: `def create_harbor_task_bundle(
    task_name: str,
    instruction: str,
    setup_cmd: str,
    verifier_code: str,
    timeout_sec: int = 120
) -> dict[str, str]:
    """
    Generates a complete Harbor task directory bundle dictionary.

    Returns:
        dict mapping relative file paths to string contents
    """
    # Your code here
    raise NotImplementedError
`,
			testCode:
				"# Tests are executed in the Docker sandbox. See executor test: harbor6_task_bundle_generator.py",
		},
	];

	for (const problem of harborProblems) {
		await prisma.problem.upsert({
			where: { slug: problem.slug },
			update: problem,
			create: problem,
		});
	}

	console.log(
		`Seeded ${harborProblems.length} problems for "${harborProblemSet.title}"`,
	);
	console.log("Harbor seed successful");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
