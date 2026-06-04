package wsb.edu.cybquiz.score.repo;

import java.util.Optional;

import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;

import wsb.edu.cybquiz.score.model.ScoreEntity;

@Repository
public class ScoreRepository {
    private final DynamoDbTable<ScoreEntity> scoreTable;

    public ScoreRepository(DynamoDbEnhancedClient client) {
        this.scoreTable = client.table("Scores", TableSchema.fromBean(ScoreEntity.class));
    }

    public void save(ScoreEntity entity) {
        scoreTable.putItem(entity);
    }

    public Optional<ScoreEntity> findById(String scoreId) {
        Key key = Key.builder().partitionValue(scoreId).build();
        return Optional.ofNullable(scoreTable.getItem(r -> r.key(key)));
    }

    public PageIterable<ScoreEntity> findAll() {
        return scoreTable.scan();
    }
}