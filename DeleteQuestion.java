package wsb.edu.cybquiz.question.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.question.service.QuestionService;

import java.util.function.Function;

@Component("deleteQuestion")
@RequiredArgsConstructor
public class DeleteQuestion implements Function<String, Boolean> {

    private final QuestionService service;

    @Override
    public Boolean apply(String id) {
        service.deleteQuestion(id);
        return Boolean.TRUE;
    }
}