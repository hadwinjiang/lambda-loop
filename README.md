# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`LambdaLoopsStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


操作手册

1. 在 CloudWatch Alarm 的 Configure actions 中，设定 SNS ("TopicForQueue") 订阅
2. 在 SNS ("TopicForMail") 中进行邮件订阅，并确认订阅
3. 触发 CloudWatch Alarm，进行测试

参考

https://www.wellarchitectedlabs.com/performance-efficiency/100_labs/100_monitoring_linux_ec2_cloudwatch/5_generating_load/

Stress
sudo amazon-linux-extras install epel -y
sudo yum install stress -y

sudo stress --cpu 8 --vm-bytes $(awk '/MemAvailable/{printf "%d\n", $2 * 0.9;}' < /proc/meminfo)k --vm-keep -m 1
sudo stress --cpu 2 --vm-bytes $(awk '/MemAvailable/{printf "%d\n", $2 * 0.9;}' < /proc/meminfo)k --vm-keep -m 1


https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/set-alarm-state.html
aws cloudwatch set-alarm-state --alarm-name "EC2-CPU-Alert" --state-value ALARM --state-reason "testing purposes"
aws cloudwatch set-alarm-state --alarm-name "Loop-Alarm" --state-value ALARM --state-reason "testing purposes"
aws cloudwatch set-alarm-state --alarm-name "EC2-CPU-Alert" --state-value INSUFFICIENT_DATA --state-reason "switch status"
aws cloudwatch set-alarm-state --alarm-name "EC2-CPU-Alert" --state-value OK --state-reason "back to normal"
