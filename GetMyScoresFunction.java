package wsb.edu.cybquiz.score.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.score.dto.ScoreResponseDto;
import wsb.edu.cybquiz.score.service.ScoreService;

import java.util.List;
import java.util.function.Function;

@Component("getMyScores")
@RequiredArgsConstructor
public class GetMyScoresFunction implements Function<String, List<ScoreResponseDto>> {

    private final ScoreService scoreService;

    @Override
    public List<ScoreResponseDto> apply(String userId) {
        return scoreService.getScoresByUser(userId);
    }
}