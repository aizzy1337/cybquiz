package wsb.edu.cybquiz.group.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.group.dto.RemoveQuizRequest;
import wsb.edu.cybquiz.group.service.GroupService;

import java.util.function.Function;

@Component("removeQuizFromGroup")
@RequiredArgsConstructor
public class RemoveQuizFromGroupFunction implements Function<RemoveQuizRequest, Boolean> {

    private final GroupService service;

    @Override
    public Boolean apply(RemoveQuizRequest req) {
        service.removeQuiz(req.groupId(), req.quizId());
        return Boolean.TRUE;
    }
}