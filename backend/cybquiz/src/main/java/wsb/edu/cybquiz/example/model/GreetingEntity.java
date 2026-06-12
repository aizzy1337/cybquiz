package wsb.edu.cybquiz.example.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Getter
@Setter
@NoArgsConstructor
@DynamoDbBean
public class GreetingEntity {
    private String id;
    private String name;
    private String timestamp;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
