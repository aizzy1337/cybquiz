package wsb.edu.cybquiz.question.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class QuestionEntity {

    private String id;
    private String name;
    private String type;
    private String createdBy;
    private String content;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

}
