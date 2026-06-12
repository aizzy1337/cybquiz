package wsb.edu.cybquiz.question.function;

import java.util.function.Function;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import wsb.edu.cybquiz.question.dto.QuestionDto;
import wsb.edu.cybquiz.question.service.QuestionService;

@Slf4j
@Component("getQuestionById")
@RequiredArgsConstructor
public class GetQuestionById implements Function<String, QuestionDto> {

    private final QuestionService questionService;

    @Override
    public QuestionDto apply(String id) {
        log.info("Reading question for id: {}", id);
        return questionService.findById(id);
    }

}
