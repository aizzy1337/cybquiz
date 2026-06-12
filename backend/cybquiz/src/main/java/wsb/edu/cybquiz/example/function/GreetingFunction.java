package wsb.edu.cybquiz.example.function;

import java.time.Instant;
import java.util.UUID;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import wsb.edu.cybquiz.example.dtos.GreetingRequestDto;
import wsb.edu.cybquiz.example.dtos.GreetingResponseDto;
import wsb.edu.cybquiz.example.model.GreetingEntity;
import wsb.edu.cybquiz.example.repo.GreetingRepository;

// Function name, will be used in the API to map requests to this function (eg.
// POST /api/function/createGreeting))
@Component("createGreeting")
@RequiredArgsConstructor
public class GreetingFunction implements Function<GreetingRequestDto, GreetingResponseDto> {

    private final GreetingRepository greetingRepository;

    @Override
    public GreetingResponseDto apply(GreetingRequestDto input) {
        String name = (input == null || input.name() == null || input.name().isEmpty()) ? "World" : input.name();

        GreetingEntity entity = new GreetingEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setName(name);
        entity.setTimestamp(Instant.now().toString());
        greetingRepository.save(entity);

        return new GreetingResponseDto("Hello, " + name + "! Welcome to CybQuiz!", 200);
    }

}
