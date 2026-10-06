import {
    Reporter,
    TestCase,
    TestResult,
    FullConfig,
    Suite
} from '@playwright/test/reporter';

declare const require: any;
declare const process: {
    cwd(): string;
};

const fs = require('fs');
const path = require('path');

interface TestReport {
    title: string;
    projectName: string;
    status: string;
    duration: number;
    error?: string;
}

class ExtentReporter implements Reporter {

    private results: TestReport[] = [];

    private startTime: Date = new Date();

    private reportDirectory =
        path.join(process.cwd(), 'reports', 'extent-report');

    private reportFile =
        path.join(this.reportDirectory, 'index.html');


    // Called when test execution starts
    onBegin(config: FullConfig, suite: Suite) {

        this.startTime = new Date();

        // Create report directory
        fs.mkdirSync(
            this.reportDirectory,
            { recursive: true }
        );

        console.log(
            'Extent Report execution started...'
        );
    }


    // Called when each test starts
    onTestBegin(
        test: TestCase,
        result: TestResult
    ) {

        console.log(
            `Starting test: ${test.title}`
        );
    }


    // Called when each test finishes
    onTestEnd(
        test: TestCase,
        result: TestResult
    ) {

        const projectName =
            test.parent.project()?.name || 'Unknown';

        let errorMessage = '';

        if (result.error) {
            errorMessage =
                result.error.message || '';
        }

        this.results.push({

            title: test.title,

            projectName: projectName,

            status: result.status,

            duration: result.duration,

            error: errorMessage
        });

        console.log(
            `Finished: ${test.title} - ${result.status}`
        );
    }


    // Called after all tests finish
    async onEnd() {

        const endTime = new Date();

        const totalDuration =
            endTime.getTime() -
            this.startTime.getTime();

        const html =
            this.generateHtml(totalDuration);

        fs.writeFileSync(
            this.reportFile,
            html,
            'utf-8'
        );

        console.log(
            `Extent Report generated at: ${this.reportFile}`
        );
    }


    private generateHtml(
        totalDuration: number
    ): string {

        const total =
            this.results.length;

        const passed =
            this.results.filter(
                result => result.status === 'passed'
            ).length;

        const failed =
            this.results.filter(
                result => result.status === 'failed'
            ).length;

        const skipped =
            this.results.filter(
                result =>
                    result.status === 'skipped'
            ).length;


        const rows =
            this.results.map(result => {

                let statusClass = '';

                if (result.status === 'passed') {
                    statusClass = 'passed';
                }
                else if (result.status === 'failed') {
                    statusClass = 'failed';
                }
                else {
                    statusClass = 'skipped';
                }


                return `
                    <tr>

                        <td>
                            ${this.escapeHtml(
                                result.title
                            )}
                        </td>

                        <td>
                            ${this.escapeHtml(
                                result.projectName
                            )}
                        </td>

                        <td class="${statusClass}">
                            ${result.status.toUpperCase()}
                        </td>

                        <td>
                            ${result.duration} ms
                        </td>

                        <td>
                            ${result.error
                                ? this.escapeHtml(
                                    result.error
                                )
                                : '-'
                            }
                        </td>

                    </tr>
                `;
            }).join('');


        return `
<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>
        SauceDemo Extent Report
    </title>

    <style>

        body {

            font-family: Arial, sans-serif;

            margin: 0;

            background: #f5f5f5;
        }


        .header {

            background: #263238;

            color: white;

            padding: 25px;

        }


        .header h1 {

            margin: 0;
        }


        .summary {

            display: flex;

            gap: 20px;

            padding: 20px;
        }


        .card {

            background: white;

            padding: 20px;

            border-radius: 6px;

            min-width: 140px;

            box-shadow:
                0 2px 5px
                rgba(0,0,0,0.15);
        }


        .card h2 {

            margin: 0 0 10px 0;
        }


        .container {

            padding: 20px;
        }


        table {

            width: 100%;

            border-collapse: collapse;

            background: white;
        }


        th,
        td {

            padding: 12px;

            border: 1px solid #ddd;

            text-align: left;
        }


        th {

            background: #37474f;

            color: white;
        }


        .passed {

            color: green;

            font-weight: bold;
        }


        .failed {

            color: red;

            font-weight: bold;
        }


        .skipped {

            color: orange;

            font-weight: bold;
        }


    </style>

</head>


<body>


    <div class="header">

        <h1>
            SauceDemo Automation Report
        </h1>

        <p>
            Playwright + TypeScript
        </p>

    </div>


    <div class="summary">


        <div class="card">

            <h2>
                ${total}
            </h2>

            <p>
                Total Tests
            </p>

        </div>


        <div class="card">

            <h2 class="passed">
                ${passed}
            </h2>

            <p>
                Passed
            </p>

        </div>


        <div class="card">

            <h2 class="failed">
                ${failed}
            </h2>

            <p>
                Failed
            </p>

        </div>


        <div class="card">

            <h2 class="skipped">
                ${skipped}
            </h2>

            <p>
                Skipped
            </p>

        </div>


        <div class="card">

            <h2>
                ${totalDuration} ms
            </h2>

            <p>
                Execution Time
            </p>

        </div>


    </div>


    <div class="container">


        <h2>
            Test Execution Details
        </h2>


        <table>


            <thead>

                <tr>

                    <th>
                        Test Name
                    </th>

                    <th>
                        Browser
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Duration
                    </th>

                    <th>
                        Error
                    </th>

                </tr>

            </thead>


            <tbody>

                ${rows}

            </tbody>


        </table>


    </div>


</body>

</html>
        `;
    }


    private escapeHtml(
        value: string
    ): string {

        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}


export default ExtentReporter;