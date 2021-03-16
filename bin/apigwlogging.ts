#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApigwloggingStack } from '../lib/apigwlogging-stack';

const app = new cdk.App();
new ApigwloggingStack(app, 'ApigwloggingStack');
