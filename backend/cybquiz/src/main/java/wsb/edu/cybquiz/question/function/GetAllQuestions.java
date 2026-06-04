package wsb.edu.cybquiz.question.function;

import java.util.List;
import java.util.function.Supplier;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import wsb.edu.cybquiz.question.dto.QuestionDto;
import wsb.edu.cybquiz.question.service.QuestionService;

@Component("getAllQuestions")
@RequiredArgsConstructor
public class GetAllQuestions implements Supplier<List<QuestionDto>> {

    private final QuestionService questionService;

    @Override
    public List<QuestionDto> get() {
        return questionService.findAll();
    }

}
