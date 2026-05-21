package wsb.edu.cybquiz.user.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import lombok.*;

@Getter
@Setter
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class UserEntity {

    private String id;
    private String login;
    private String password;
    private String role;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}