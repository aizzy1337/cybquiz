package wsb.edu.cybquiz.score.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.score.dto.ScoreResponseDto;
import wsb.edu.cybquiz.score.service.ScoreService;

import java.util.List;
import java.util.function.Supplier;

@Component("getAllScores")
@RequiredArgsConstructor
public class GetAllScoresFunction implements Supplier<List<ScoreResponseDto>> {

    private final ScoreService scoreService;

    @Override
    public List<ScoreResponseDto> get() {
        return scoreService.getAllScores();
    }
}
