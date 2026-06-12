package wsb.edu.cybquiz.quiz.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponseDto {
    private String id;
    private String title;
    private String createdBy;
    private List<String> questionIds;
}