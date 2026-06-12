package wsb.edu.cybquiz.quiz.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.quiz.dto.QuizResponseDto;
import wsb.edu.cybquiz.quiz.dto.UpdateQuizRequest;
import wsb.edu.cybquiz.quiz.service.QuizService;

import java.util.function.Function;


@Component("updateQuiz")
@RequiredArgsConstructor
public class UpdateQuizFunction implements Function<UpdateQuizRequest, QuizResponseDto> {

    private final QuizService service;

    @Override
    public QuizResponseDto apply(UpdateQuizRequest req) {
        return service.update(req.getId(), req.getDto());
    }
}