package wsb.edu.cybquiz.question.repo;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;
import wsb.edu.cybquiz.question.model.QuestionEntity;

@Repository
public class QuestionRepository {

    private final DynamoDbTable<QuestionEntity> questionTable;

    public QuestionRepository(DynamoDbEnhancedClient client) {
        this.questionTable = client.table("Questions", TableSchema.fromBean(QuestionEntity.class));
    }

    public void save(QuestionEntity entity) {
        questionTable.putItem(entity);
    }

    public Optional<QuestionEntity> findById(String id) {
        Key key = Key.builder().partitionValue(id).build();
        return Optional.ofNullable(questionTable.getItem(r -> r.key(key)));
    }

    public PageIterable<QuestionEntity> findAll() {
        return questionTable.scan();
    }

    public void delete(String id) {
        questionTable.deleteItem(Key.builder().partitionValue(id).build());
    }

}
