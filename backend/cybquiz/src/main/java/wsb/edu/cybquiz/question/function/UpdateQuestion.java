package wsb.edu.cybquiz.question.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.question.dto.QuestionDto;
import wsb.edu.cybquiz.question.service.QuestionService;

import java.util.function.Function;

@Component("updateQuestion")
@RequiredArgsConstructor
public class UpdateQuestion implements Function<QuestionDto, QuestionDto> {

    private final QuestionService service;

    @Override
    public QuestionDto apply(QuestionDto dto) {
        return service.updateQuestion(dto);
    }
}