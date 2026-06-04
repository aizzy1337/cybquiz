package wsb.edu.cybquiz.score.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.score.service.ScoreService;
import wsb.edu.cybquiz.score.dto.ScoreDto;
import wsb.edu.cybquiz.score.dto.ScoreResponseDto;

import java.util.List;
import java.util.function.Function;
import java.util.function.Supplier;

@Component("createScore")
@RequiredArgsConstructor
public class CreateScoreFunction implements Function<ScoreDto, ScoreResponseDto> {

    private final ScoreService scoreService;

    @Override
    public ScoreResponseDto apply(ScoreDto dto) {
        return scoreService.saveScore(dto);
    }
}

