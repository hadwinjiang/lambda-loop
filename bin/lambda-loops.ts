#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaLoopsStack } from '../lib/lambda-loops-stack';

const app = new cdk.App();
new LambdaLoopsStack(app, 'LambdaLoopsStack');
