package wsb.edu.cybquiz.group.repo;

import java.util.Optional;

import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;

import wsb.edu.cybquiz.group.model.GroupEntity;

@Repository
public class GroupRepository {

    private final DynamoDbTable<GroupEntity> table;

    public GroupRepository(DynamoDbEnhancedClient client) {
        this.table = client.table("Groups", TableSchema.fromBean(GroupEntity.class));
    }

    public void save(GroupEntity entity) {
        table.putItem(entity);
    }

    public Optional<GroupEntity> findById(String id) {
        Key key = Key.builder().partitionValue(id).build();
        return Optional.ofNullable(table.getItem(r -> r.key(key)));
    }

    public PageIterable<GroupEntity> findAll() {
        return table.scan();
    }
}
