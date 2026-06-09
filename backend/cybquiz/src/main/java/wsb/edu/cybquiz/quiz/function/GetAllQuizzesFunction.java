package wsb.edu.cybquiz.quiz.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.quiz.dto.QuizResponseDto;
import wsb.edu.cybquiz.quiz.service.QuizService;

import java.util.List;
import java.util.function.Supplier;

@Component("getAllQuizzes")
@RequiredArgsConstructor
public class GetAllQuizzesFunction implements Supplier<List<QuizResponseDto>> {

    private final QuizService service;

    @Override
    public List<QuizResponseDto> get() {
        return service.findAll();
    }
}
