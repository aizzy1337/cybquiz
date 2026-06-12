package wsb.edu.cybquiz.quiz.model;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class QuizEntity {

    private String id;
    private String title;
    private String createdBy;
    private List<String> questionIds;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}