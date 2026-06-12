package wsb.edu.cybquiz.quiz.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.quiz.dto.QuizResponseDto;
import wsb.edu.cybquiz.quiz.service.QuizService;

import java.util.List;
import java.util.function.Function;

@Component("getQuizzesByCreator")
@RequiredArgsConstructor
class GetQuizzesByCreatorFunction implements Function<String, List<QuizResponseDto>> {

    private final QuizService service;

    @Override
    public List<QuizResponseDto> apply(String userId) {
        return service.findByCreator(userId);
    }
}