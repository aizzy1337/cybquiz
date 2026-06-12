package wsb.edu.cybquiz.group.model;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class GroupEntity {

    private String id;
    private String legacyGroupId;
    private String name;
    private String adminId;
    private String joinCode;
    private List<String> quizIds;
    private List<String> userIds;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("groupId")
    public String getLegacyGroupId() {
        return legacyGroupId;
    }

    public void setLegacyGroupId(String legacyGroupId) {
        this.legacyGroupId = legacyGroupId;
        if ((this.id == null || this.id.isBlank()) && legacyGroupId != null && !legacyGroupId.isBlank()) {
            this.id = legacyGroupId;
        }
    }

    public String getEffectiveId() {
        if (id != null && !id.isBlank()) {
            return id;
        }
        return legacyGroupId;
    }
}