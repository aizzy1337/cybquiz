package wsb.edu.cybquiz.example.repo;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import wsb.edu.cybquiz.example.model.GreetingEntity;

@Repository
public class GreetingRepository {
    private final DynamoDbTable<GreetingEntity> greetingTable;

    public GreetingRepository(DynamoDbEnhancedClient client) {
        // Inicjalizacja schematu tabeli w jednym miejscu
        this.greetingTable = client.table("Greetings", TableSchema.fromBean(GreetingEntity.class));
    }

    public void save(GreetingEntity entity) {
        greetingTable.putItem(entity);
    }

    public Optional<GreetingEntity> findById(String id) {
        Key key = Key.builder().partitionValue(id).build();
        return Optional.ofNullable(greetingTable.getItem(r -> r.key(key)));
    }
}
