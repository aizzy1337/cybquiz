package wsb.edu.cybquiz.quiz.repo;

import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.*;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import wsb.edu.cybquiz.quiz.model.QuizEntity;

import java.util.Optional;

@Repository
public class QuizRepository {

    private final DynamoDbTable<QuizEntity> table;

    public QuizRepository(DynamoDbEnhancedClient client) {
        this.table = client.table("Quizzes", TableSchema.fromBean(QuizEntity.class));
    }

    public void save(QuizEntity entity) {
        table.putItem(entity);
    }

    public Optional<QuizEntity> findById(String id) {
        return Optional.ofNullable(
                table.getItem(r -> r.key(Key.builder().partitionValue(id).build()))
        );
    }

    public PageIterable<QuizEntity> findAll() {
        return table.scan();
    }

    public void delete(String id) {
        table.deleteItem(Key.builder().partitionValue(id).build());
    }
}