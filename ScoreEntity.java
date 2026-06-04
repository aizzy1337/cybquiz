package wsb.edu.cybquiz.score.model;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class ScoreEntity {

    private String id;
    private String groupId;
    private String userId;
    private String quizId;
    private int correct;
    private int total;
    private String createdAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}