import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as logs from '@aws-cdk/aws-logs'

export class ApigwloggingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const PREFIX_NAME = id.toLocaleLowerCase().replace('stack', '')
    
    const loggroup = new logs.LogGroup(this, "loggroup", {
      logGroupName: PREFIX_NAME + "-loggroup",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    
    const api = new apigateway.RestApi(this, 'api', { 
      restApiName: PREFIX_NAME + '-api',
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(loggroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          caller: false,
          httpMethod: false,
          ip: true,
          protocol: false,
          requestTime: true,
          resourcePath: true,
          responseLength: false,
          status: true,
          user: false
        }),
        dataTraceEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO
      }
    });
    
    const integration = new apigateway.MockIntegration({
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': JSON.stringify({
          statusCode: 200
        })
      },
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'text/plain': 'こんにちは'
        }
      }]
    })
    
    api.root.addMethod('GET', integration, {
      methodResponses: [{
        statusCode: '200',
        responseModels: {
          'text/plain': new apigateway.EmptyModel()
        }
      }]}
    )

  }
}
