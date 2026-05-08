package wsb.edu.cybquiz.group.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.group.dto.AddQuizRequest;
import wsb.edu.cybquiz.group.service.GroupService;

import java.util.function.Function;

@Component("addQuizToGroup")
@RequiredArgsConstructor
public class AddQuizToGroupFunction implements Function<AddQuizRequest, Boolean> {

    private final GroupService service;

    @Override
    public Boolean apply(AddQuizRequest req) {
        service.addQuiz(req.groupId(), req.quizId());
        return Boolean.TRUE;
    }
}