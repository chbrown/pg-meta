BIN := node_modules/.bin
TYPESCRIPT := $(shell jq -r '.files[]' tsconfig.json | grep -Fv .d.ts)
DERIVED = $(TYPESCRIPT:%.ts=%.js) $(TYPESCRIPT:%.ts=%.d.ts)

all: $(DERIVED) .gitignore .npmignore

$(BIN)/tsc:
	npm install

.gitignore: tsconfig.json
	echo $(DERIVED) | tr ' ' '\n' > $@

.npmignore: tsconfig.json
	echo $(TYPESCRIPT) Makefile tsconfig.json | tr ' ' '\n' > $@

%.js %.d.ts: %.ts $(BIN)/tsc
	$(BIN)/tsc -d

clean:
	rm -f $(DERIVED)
