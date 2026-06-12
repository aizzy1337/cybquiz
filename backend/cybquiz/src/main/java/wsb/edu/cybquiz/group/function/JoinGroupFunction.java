package wsb.edu.cybquiz.group.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.group.dto.JoinGroupRequest;
import wsb.edu.cybquiz.group.service.GroupService;

import java.util.function.Function;

@Component("joinGroup")
@RequiredArgsConstructor
public class JoinGroupFunction implements Function<JoinGroupRequest, Boolean> {

    private final GroupService service;

    @Override
    public Boolean apply(JoinGroupRequest req) {
        service.joinGroup(req.groupId(), req.joinCode(), req.userId());
        return Boolean.TRUE;
    }
}