package wsb.edu.cybquiz.user.repo;

import java.util.Optional;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;
import wsb.edu.cybquiz.user.model.UserEntity;

@Repository
public class UserRepository {

    private final DynamoDbTable<UserEntity> userTable;

    public UserRepository(DynamoDbEnhancedClient client) {
        this.userTable = client.table("Users", TableSchema.fromBean(UserEntity.class));
    }

    public void save(UserEntity entity) {
        userTable.putItem(entity);
    }

    public Optional<UserEntity> findById(String userId) {
        Key key = Key.builder().partitionValue(userId).build();
        return Optional.ofNullable(userTable.getItem(r -> r.key(key)));
    }

    public Optional<UserEntity> findByLogin(String login) {
        return userTable.scan()
                .items()
                .stream()
                .filter(u -> u.getLogin().equalsIgnoreCase(login))
                .findFirst();
    }

    public PageIterable<UserEntity> findAll() {
        return userTable.scan();
    }
}