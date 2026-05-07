package wsb.edu.cybquiz.configuration;

import java.net.URI;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.DynamoDbClientBuilder;

@Slf4j
@Configuration
public class DynamoDbConfig {

    @Bean
    public DynamoDbClient dynamoDbClient() {
        DynamoDbClientBuilder builder = DynamoDbClient.builder()
                .httpClientBuilder(UrlConnectionHttpClient.builder());

        String localstackHostname = System.getenv("LOCALSTACK_HOSTNAME");
        String localIdeEndpoint = System.getenv("AWS_ENDPOINT_URL");

        if (localstackHostname != null && !localstackHostname.isEmpty()) {
            log.info("[LAMBDA] LOCALSTACK IP DETECTED: {}", localstackHostname);
            builder.endpointOverride(URI.create("http://" + localstackHostname + ":4566"))
                    .region(Region.US_EAST_1)
                    .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create("test", "test")));

        } else if (localIdeEndpoint != null && !localIdeEndpoint.isEmpty()) {
            log.info("[IDE] ENVIRONMENT VARIABLE DETECTED: {}", localIdeEndpoint);
            builder.endpointOverride(URI.create(localIdeEndpoint))
                    .region(Region.US_EAST_1)
                    .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create("test", "test")));
        }

        return builder.build();
    }

    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }

}
