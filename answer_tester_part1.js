import { execSync } from "child_process";
import fs from "fs";
export function start_test(unit_test_module_name, answer_module_name) {
	var unit_test_template = `from <unit_test_module> import unit_test
from <answer_module> import main
print(unit_test(main))`;

	unit_test_template.replace("<unit_test_module>", unit_test_module_name);
	unit_test_template.replace("<answer_module>", answer_module_name);

	fs.writeFileSync(`${answer_module_name}-tester.py`, unit_test_template);

	var result = JSON.parse(execSync("./answer_tester_part2.bash").toString());
	return result;
}
