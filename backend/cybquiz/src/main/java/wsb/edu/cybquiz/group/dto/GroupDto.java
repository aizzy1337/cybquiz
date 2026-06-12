package wsb.edu.cybquiz.group.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDto {
    private String id;
    private String name;
    private String adminId;
    private String joinCode;
    private List<String> quizIds;
    private List<String> userIds;
}