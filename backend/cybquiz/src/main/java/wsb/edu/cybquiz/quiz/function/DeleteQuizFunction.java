package wsb.edu.cybquiz.quiz.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.quiz.service.QuizService;

import java.util.function.Function;

@Component("deleteQuiz")
@RequiredArgsConstructor
class DeleteQuizFunction implements Function<String, Boolean> {

    private final QuizService service;

    @Override
    public Boolean apply(String id) {
        service.delete(id);
        return Boolean.TRUE;
    }
}