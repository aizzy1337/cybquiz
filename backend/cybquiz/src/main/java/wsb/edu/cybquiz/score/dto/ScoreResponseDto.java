package wsb.edu.cybquiz.score.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreResponseDto {
    private String id;
    private String groupId;
    private String userId;
    private String quizId;
    private int correct;
    private int total;
    private String createdAt;
}