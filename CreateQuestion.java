package wsb.edu.cybquiz.question.function;

import java.util.function.Function;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import wsb.edu.cybquiz.question.dto.QuestionCreateResponseDto;
import wsb.edu.cybquiz.question.dto.QuestionDto;
import wsb.edu.cybquiz.question.service.QuestionService;

@Component("createQuestion")
@RequiredArgsConstructor
public class CreateQuestion implements Function<QuestionDto, QuestionCreateResponseDto> {

    private final QuestionService questionService;

    @Override
    public QuestionCreateResponseDto apply(QuestionDto dto) {
        return questionService.createQuestion(dto);
    }

}
