package wsb.edu.cybquiz.question.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private String id;
    private String name;
    private String type;
    private String createdBy;
    private String content;
}
