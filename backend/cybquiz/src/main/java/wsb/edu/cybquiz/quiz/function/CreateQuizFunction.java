package wsb.edu.cybquiz.quiz.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.quiz.dto.QuizDto;
import wsb.edu.cybquiz.quiz.dto.QuizResponseDto;
import wsb.edu.cybquiz.quiz.service.QuizService;

import java.util.function.Function;

@Component("createQuiz")
@RequiredArgsConstructor
public class CreateQuizFunction implements Function<QuizDto, QuizResponseDto> {

    private final QuizService service;

    @Override
    public QuizResponseDto apply(QuizDto dto) {
        return service.create(dto);
    }
}